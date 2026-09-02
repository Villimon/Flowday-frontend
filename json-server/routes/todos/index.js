import { enrichTodosWithLabels } from '../../lib/enrichTodosWithLabels.js';
import {
    parseISO,
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    isBefore,
    isAfter,
    isSameDay,
    compareAsc,
} from 'date-fns';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
import { enrichTodoWithLabels } from '../../lib/enrichTodoWithLabels.js';

export default (server, router) => {
    server.post('/api/todos', (req, res) => {
        try {
            const userId = req.headers.userid;
            const { title, description, labels, startDate, endDate } = req.body;

            const { db } = router;

            const newTodo = {
                id: String(Date.now()),
                title,
                description,
                completed: false,
                userId,
                labels,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                startDate,
                endDate,
            };

            const enrichedTodo = enrichTodoWithLabels(newTodo, db);

            const todos = db.get('todos');

            todos.push(newTodo).write();

            res.status(201).json({
                success: true,
                message: 'Задача успешно создана',
                data: enrichedTodo,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    });

    server.get('/api/todos', (req, res) => {
        try {
            const userId = req.headers.userid;
            const { status = 'all', view = 'day', date, timezone = 'Europe/Moscow' } = req.query;

            const { db } = router;

            if (!userId) {
                return res
                    .status(400)
                    .json({ success: false, message: 'Заголовок "userid" обязателен' });
            }

            // 1. Получаем и обогащаем задачи
            const rawTodos = db.get('todos').filter({ userId }).value();
            const enrichedTodos = enrichTodosWithLabels(rawTodos, db);

            // --- ХЕЛПЕР: Перевод даты в нужную таймзону пользователя ---
            const getZonedDate = dateInput => {
                const parsed = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
                return toZonedTime(parsed, timezone);
            };

            // --- ФУНКЦИЯ ПРОВЕРКИ: ЕСТЬ ЛИ У ЗАДАЧИ РЕАЛЬНОЕ ВРЕМЯ? ---
            const hasRealTime = todo => {
                const dateToCheck = todo.startDate || todo.endDate;

                if (!dateToCheck) return false;

                const zonedDate = getZonedDate(dateToCheck);

                return !(
                    zonedDate.getHours() === 0 &&
                    zonedDate.getMinutes() === 0 &&
                    zonedDate.getSeconds() === 0
                );
            };

            // Функция проверки: попадает ли "сегодня" в диапазон задачи
            const isTargetTodayInInterval = (targetToday, start, end) => {
                const s = startOfDay(getZonedDate(start));
                const e = startOfDay(getZonedDate(end));
                const t = startOfDay(targetToday);
                return (isBefore(s, t) || isSameDay(s, t)) && (isAfter(e, t) || isSameDay(e, t));
            };

            const sortTodosForClient = todos => {
                // 1. Разделяем на активные и выполненные
                const active = todos.filter(t => !t.completed);
                const completed = todos.filter(t => t.completed);

                // 2. Активные: сначала те, у которых есть startDate (хронологически), затем без даты
                active.sort((a, b) => {
                    const dateA = a.startDate || a.endDate;
                    const dateB = b.startDate || b.endDate;

                    if (!dateA && !dateB) {
                        return new Date(b.createdAt) - new Date(a.createdAt); // Новые сверху
                    }
                    if (!dateA) return 1;
                    if (!dateB) return -1;

                    // Сортировка по возрастанию времени старта
                    const compareStart = new Date(dateA) - new Date(dateB);
                    if (compareStart !== 0) return compareStart;

                    if (a.endDate && b.endDate) {
                        return new Date(a.endDate) - new Date(b.endDate);
                    }
                    return 0;
                });

                // 3. Выполненные: свежевыполненные всегда сверху
                completed.sort((a, b) => {
                    const aDate = a.updatedAt || a.createdAt;
                    const bDate = b.updatedAt || b.createdAt;
                    return new Date(bDate) - new Date(aDate);
                });

                // 4. Склеиваем: активные всегда выше выполненных
                return [...active, ...completed];
            };

            // === РЕЖИМ 1: СПИСОК (view === 'list') ===
            if (view === 'list') {
                const counts = {
                    all: enrichedTodos.length,
                    active: enrichedTodos.filter(t => !t.completed).length,
                    completed: enrichedTodos.filter(t => t.completed).length,
                };

                let todosToProcess = enrichedTodos;
                if (status === 'active') todosToProcess = enrichedTodos.filter(t => !t.completed);
                if (status === 'completed') todosToProcess = enrichedTodos.filter(t => t.completed);

                // Текущий день пользователя в его таймзоне (строка YYYY-MM-DD)
                const userTodayStr = formatInTimeZone(new Date(), timezone, 'yyyy-MM-dd');
                const targetToday = startOfDay(parseISO(userTodayStr));

                const weekStart = startOfDay(startOfWeek(targetToday, { weekStartsOn: 1 })); // Понедельник
                const weekEnd = endOfDay(endOfWeek(targetToday, { weekStartsOn: 1 })); // Воскресенье

                const allCompleted = todosToProcess.filter(todo => todo.completed);
                const allActive = todosToProcess.filter(todo => !todo.completed);

                const getTodoDeadline = todo => {
                    return todo.endDate
                        ? startOfDay(getZonedDate(todo.endDate))
                        : startOfDay(getZonedDate(todo.startDate));
                };

                // 1. OVERDUE (просроченные)
                const overdue = allActive.filter(todo => {
                    if (!todo.startDate && !todo.endDate) return false;
                    return isBefore(getTodoDeadline(todo), targetToday);
                });

                // 2. TODAY (сегодня)
                const today = allActive.filter(todo => {
                    if (!todo.startDate && !todo.endDate) return false;
                    if (todo.startDate && todo.endDate) {
                        return isTargetTodayInInterval(targetToday, todo.startDate, todo.endDate);
                    }
                    if (
                        todo.startDate &&
                        isSameDay(startOfDay(getZonedDate(todo.startDate)), targetToday)
                    )
                        return true;
                    if (
                        todo.endDate &&
                        isSameDay(startOfDay(getZonedDate(todo.endDate)), targetToday)
                    )
                        return true;
                    return false;
                });

                // 3. THIS WEEK (эта неделя)
                const thisWeek = allActive.filter(todo => {
                    if (!todo.startDate && !todo.endDate) return false;

                    const todoStart = todo.startDate
                        ? startOfDay(getZonedDate(todo.startDate))
                        : startOfDay(getZonedDate(todo.endDate));
                    const todoEnd = todo.endDate
                        ? endOfDay(getZonedDate(todo.endDate))
                        : endOfDay(getZonedDate(todo.startDate));

                    // Проверяем, что задача начинается СТРОГО позже, чем сегодня
                    const isFutureTask = isAfter(todoStart, targetToday);

                    // Попадает ли в границы текущей недели
                    const intersectsWithWeek =
                        (isBefore(todoStart, weekEnd) || isSameDay(todoStart, weekEnd)) &&
                        (isAfter(todoEnd, weekStart) || isSameDay(todoEnd, weekStart));

                    return isFutureTask && intersectsWithWeek;
                });

                // 4. UPCOMING (будущие)
                const upcoming = allActive.filter(todo => {
                    if (!todo.startDate) return false;
                    const todoStart = startOfDay(getZonedDate(todo.startDate));
                    return isAfter(todoStart, weekEnd);
                });

                // 5. WITHOUT DATE (без даты)
                const withoutDate = allActive.filter(todo => !todo.startDate && !todo.endDate);

                // 6. COMPLETED (завершенные)
                const completed = allCompleted.sort((a, b) =>
                    compareAsc(parseISO(b.updatedAt), parseISO(a.updatedAt))
                );

                return res.status(200).json({
                    success: true,
                    message: 'Задачи получены (режим списка)',
                    data: {
                        todos: {
                            overdue: sortTodosForClient(overdue),
                            today: sortTodosForClient(today),
                            thisWeek: sortTodosForClient(thisWeek),
                            upcoming: sortTodosForClient(upcoming),
                            withoutDate: sortTodosForClient(withoutDate),
                            completed: sortTodosForClient(completed),
                        },
                        counts,
                    },
                });
            }

            // === РЕЖИМ 2: ДЕНЬ (view === 'day') ===
            if (view === 'day') {
                if (!date)
                    return res
                        .status(400)
                        .json({ success: false, message: 'Параметр "date" обязателен для day' });

                // targetDate — день, который пользователь сейчас просматривает в календаре
                const targetDate = startOfDay(parseISO(date.split('T')[0]));

                // Получаем текущую дату пользователя (сегодня) с учетом его таймзоны
                const userTodayStr = formatInTimeZone(new Date(), timezone, 'yyyy-MM-dd');
                const userToday = startOfDay(parseISO(userTodayStr));

                // Флаг: смотрит ли пользователь сегодняшний день
                const isRequestedToday = isSameDay(targetDate, userToday);

                const withDateTodos = [];
                const withoutDateTodos = [];

                for (const todo of enrichedTodos) {
                    const hasStart = !!todo.startDate;
                    const hasEnd = !!todo.endDate;
                    const hasTime = hasRealTime(todo); // Проверка, заданы ли часы/минуты

                    // --- ЛОГИКА ДЛЯ БЛОКА "БЕЗ ВРЕМЕНИ" (withoutDate) ---
                    // Если вообще нет дат ИЛИ дата есть, но время не указано
                    if ((!hasStart && !hasEnd) || ((hasStart || hasEnd) && !hasTime)) {
                        // Эти задачи отдаем СТРОГО только сегодня
                        if (isRequestedToday) {
                            withoutDateTodos.push(todo);
                        }
                        continue;
                    }

                    // --- ЛОГИКА ДЛЯ "РАСПИСАНИЯ" (withDate) — ТУТ ВСЕ ЗАДАЧИ С ХОРОШИМ ВРЕМЕНЕМ ---
                    let s;
                    let e;

                    // 1. Есть начальная дата, нет окончания, есть время -> Задача одного конкретного дня
                    if (hasStart && !hasEnd && hasTime) {
                        s = startOfDay(getZonedDate(todo.startDate));
                        e = s;
                    }
                    // 2. Нет начальной даты, но есть окончание и время -> Показываем каждый день, начиная с "сегодня" до дня окончания
                    else if (!hasStart && hasEnd && hasTime) {
                        s = userToday; // Стартует с сегодняшнего дня пользователя
                        e = startOfDay(getZonedDate(todo.endDate));
                    }
                    // 3. Есть и дата начала, и дата окончания со временем -> Показывается во все дни диапазона
                    else if (hasStart && hasEnd && hasTime) {
                        s = startOfDay(getZonedDate(todo.startDate));
                        e = startOfDay(getZonedDate(todo.endDate));
                    } else {
                        continue; // На всякий случай отсекаем непредусмотренные комбинации
                    }

                    // Проверяем, попадает ли просматриваемый день в вычисленный диапазон
                    const isWithinRange =
                        (isAfter(targetDate, s) || isSameDay(targetDate, s)) &&
                        (isBefore(targetDate, e) || isSameDay(targetDate, e));

                    if (isWithinRange) {
                        withDateTodos.push(todo);
                    }
                }

                const allDayTodos = [...withDateTodos, ...withoutDateTodos];

                const counts = {
                    active: allDayTodos.filter(t => !t.completed).length,
                    completed: allDayTodos.filter(t => t.completed).length,
                    all: allDayTodos.length,
                };

                let filteredWithDate = withDateTodos;
                let filteredWithoutDate = withoutDateTodos;

                if (status === 'active') {
                    filteredWithDate = withDateTodos.filter(t => !t.completed);
                    filteredWithoutDate = withoutDateTodos.filter(t => !t.completed);
                } else if (status === 'completed') {
                    filteredWithDate = withDateTodos.filter(t => t.completed);
                    filteredWithoutDate = withoutDateTodos.filter(t => t.completed);
                }

                // Разделяем расписание на активные и выполненные для правильной сортировки
                const scheduleActive = filteredWithDate.filter(todo => !todo.completed);
                const scheduleCompleted = filteredWithDate.filter(todo => todo.completed);

                // Разделяем блок "Без времени" на активные и выполненные
                const noTimeActive = filteredWithoutDate.filter(todo => !todo.completed);
                const noTimeCompleted = filteredWithoutDate.filter(todo => todo.completed);

                // Сортировка расписания (по времени старта)
                scheduleActive.sort((a, b) => {
                    const dateA = a.startDate || a.endDate;
                    const dateB = b.startDate || b.endDate;
                    return compareAsc(parseISO(dateA), parseISO(dateB));
                });
                scheduleCompleted.sort((a, b) =>
                    compareAsc(parseISO(b.updatedAt), parseISO(a.updatedAt))
                );

                // Сортировка блока без времени (новые сверху / по обновлению)
                noTimeActive.sort((a, b) =>
                    compareAsc(parseISO(b.createdAt), parseISO(a.createdAt))
                );
                noTimeCompleted.sort((a, b) =>
                    compareAsc(parseISO(b.updatedAt), parseISO(a.updatedAt))
                );

                return res.status(200).json({
                    success: true,
                    message: 'Задачи получены (режим дня)',
                    data: {
                        todos: {
                            // Строго задачи со временем, попавшие в этот день
                            withDate: sortTodosForClient([...scheduleActive, ...scheduleCompleted]),
                            // Задачи без времени (и без дат), возвращаются только для "Сегодня"
                            withoutDate: sortTodosForClient([...noTimeActive, ...noTimeCompleted]),
                        },
                        counts,
                    },
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    });

    server.patch('/api/todos/:id/toggle', (req, res) => {
        try {
            const userId = req.headers.userid;
            const todoId = req.params.id;

            const { db } = router;

            const todo = db.get('todos').find({ userId, id: todoId }).value();

            if (!todo) {
                return res.status(404).json({
                    message: 'Задача не найдена',
                });
            }

            todo.completed = !todo.completed;
            todo.updatedAt = new Date().toISOString();

            db.get('todos')
                .find({ id: todoId, userId })
                .assign({
                    completed: todo.completed,
                    updatedAt: todo.updatedAt,
                })
                .write();

            res.status(200).json({
                success: true,
                message: 'Статус задачи успешно изменен',
                data: todo,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    });

    server.delete('/api/todos/completed', (req, res) => {
        try {
            const userId = req.headers.userid;
            const timezone = req.headers['x-timezone'];

            const { view, date } = req.query;

            const { db } = router;

            if (view === 'day' && !date) {
                return res.status(400).json({
                    success: false,
                    message: 'Параметр "date" обязателен для day',
                });
            }

            let targetDateStr = '';
            let userTodayStr = '';
            let isRequestedToday = false;

            if (view === 'day') {
                // YYYY-MM-DD дня, который смотрит пользователь
                targetDateStr = String(date);
                // YYYY-MM-DD сегодняшнего дня в таймзоне пользователя
                userTodayStr = formatInTimeZone(new Date(), timezone, 'yyyy-MM-dd');
                // Флаг: смотрит ли юзер СЕГОДНЯ
                isRequestedToday = targetDateStr === userTodayStr;
            }

            const isUnscheduledTask = todo => {
                const dateToCheck = todo.startDate || todo.endDate;
                if (!dateToCheck) return true;

                const zonedDate = toZonedTime(new Date(dateToCheck), timezone);
                return (
                    zonedDate.getHours() === 0 &&
                    zonedDate.getMinutes() === 0 &&
                    zonedDate.getSeconds() === 0
                );
            };

            const getTaskDateStr = todo => {
                const rawDate = todo.startDate || todo.endDate;
                if (!rawDate) return null;
                return formatInTimeZone(new Date(rawDate), timezone, 'yyyy-MM-dd');
            };

            db.get('todos')
                .remove(todo => {
                    if (!todo.completed || userId !== todo.userId) {
                        return false;
                    }

                    if (view === 'list') {
                        return true;
                    }

                    if (view === 'day') {
                        const taskDateStr = getTaskDateStr(todo);

                        // 1. Задача привязана к просматриваемому дню
                        const isTaskOnTargetDate =
                            taskDateStr !== null && taskDateStr === targetDateStr;

                        // 2. Задача "без даты" (даты нет вообще ИЛИ время 00:00:00)
                        const isUnscheduled = isUnscheduledTask(todo);

                        // 1. Если дата задачи = просматриваемый день -> УДАЛЯЕМ
                        if (isTaskOnTargetDate) {
                            return true;
                        }

                        // 2. Если смотрит "Сегодня" И задача "без времени" -> УДАЛЯЕМ
                        if (isRequestedToday && isUnscheduled) {
                            return true;
                        }
                        return false;
                    }
                    return false;
                })
                .write();

            res.status(200).json({
                success: true,
                message: 'Все выполненные задачи удалены',
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    });

    server.delete('/api/todos/:id', (req, res) => {
        try {
            const userId = req.headers.userid;
            const todoId = req.params.id;
            const { db } = router;

            db.get('todos').remove({ id: todoId, userId }).write();

            res.status(200).json({
                success: true,
                message: 'Задача успешно удалена',
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    });

    server.put('/api/todos/:id', (req, res) => {
        try {
            const data = req.body;
            const userId = req.headers.userid;
            const todoId = req.params.id;

            const { db } = router;

            const todo = db.get('todos').find({ userId, id: todoId }).value();

            if (!todo) {
                return res.status(404).json({
                    message: 'Задача не найдена',
                });
            }

            const updatedTodo = {
                ...todo,
                updatedAt: new Date().toISOString(),
                title: data.title,
                description: data.description,
                labels: data.labels,
                startDate: data.startDate,
                endDate: data.endDate,
            };

            db.get('todos').find({ id: todoId, userId }).assign(updatedTodo).write();

            const enrichedTodo = enrichTodoWithLabels(updatedTodo, db);

            res.status(200).json({
                success: true,
                message: 'Задачи успешно изменена',
                data: enrichedTodo,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    });
};
