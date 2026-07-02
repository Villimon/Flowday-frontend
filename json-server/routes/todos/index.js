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
                if (!todo.startDate) return false;
                const zonedStart = getZonedDate(todo.startDate);
                // Если часы, минуты и секунды по нулям — значит времени нет (полночь)
                return !(
                    zonedStart.getHours() === 0 &&
                    zonedStart.getMinutes() === 0 &&
                    zonedStart.getSeconds() === 0
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
                    if (!a.startDate && !b.startDate) {
                        return new Date(b.createdAt) - new Date(a.createdAt); // Новые сверху
                    }
                    if (!a.startDate) return 1;
                    if (!b.startDate) return -1;

                    // Сортировка по возрастанию времени старта
                    const compareStart = new Date(a.startDate) - new Date(b.startDate);
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

                // 1. OVERDUE (просроченные)
                const overdue = allActive.filter(todo => {
                    if (!todo.endDate) return false;
                    const todoEnd = startOfDay(getZonedDate(todo.endDate));
                    return isBefore(todoEnd, targetToday);
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

                    const intersectsWithWeek =
                        (isBefore(todoStart, weekEnd) || isSameDay(todoStart, weekEnd)) &&
                        (isAfter(todoEnd, weekStart) || isSameDay(todoEnd, weekStart));

                    const isStrictlyToday =
                        todo.startDate && todo.endDate
                            ? isTargetTodayInInterval(targetToday, todo.startDate, todo.endDate)
                            : (todo.startDate &&
                                  isSameDay(
                                      startOfDay(getZonedDate(todo.startDate)),
                                      targetToday
                                  )) ||
                              (todo.endDate &&
                                  isSameDay(startOfDay(getZonedDate(todo.endDate)), targetToday));

                    return intersectsWithWeek && !isStrictlyToday;
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

                const targetDate = startOfDay(parseISO(date.split('T')[0]));
                const dayStart = startOfDay(targetDate);
                const dayEnd = endOfDay(targetDate);

                let statusFiltered = enrichedTodos;
                if (status === 'active') statusFiltered = enrichedTodos.filter(t => !t.completed);
                if (status === 'completed') statusFiltered = enrichedTodos.filter(t => t.completed);

                const withDateTodos = statusFiltered.filter(todo => {
                    if (!todo.startDate && !todo.endDate) return false;
                    const s = todo.startDate ? startOfDay(getZonedDate(todo.startDate)) : dayStart;
                    const e = todo.endDate
                        ? endOfDay(getZonedDate(todo.endDate))
                        : endOfDay(getZonedDate(todo.startDate));

                    return (
                        (isBefore(s, dayEnd) || isSameDay(s, dayEnd)) &&
                        (isAfter(e, dayStart) || isSameDay(e, dayStart))
                    );
                });

                const userTodayStr = formatInTimeZone(new Date(), timezone, 'yyyy-MM-dd');
                const withoutDateTodos = isSameDay(targetDate, startOfDay(parseISO(userTodayStr)))
                    ? statusFiltered.filter(todo => !todo.startDate && !todo.endDate)
                    : [];

                const scheduleActive = withDateTodos.filter(
                    todo => !todo.completed && hasRealTime(todo)
                );
                const scheduleCompleted = withDateTodos.filter(
                    todo => todo.completed && hasRealTime(todo)
                );

                const noTimeActive = [
                    ...withoutDateTodos.filter(todo => !todo.completed),
                    ...withDateTodos.filter(todo => !todo.completed && !hasRealTime(todo)),
                ];

                const noTimeCompleted = [
                    ...withoutDateTodos.filter(todo => todo.completed),
                    ...withDateTodos.filter(todo => todo.completed && !hasRealTime(todo)),
                ];

                scheduleActive.sort((a, b) =>
                    compareAsc(parseISO(a.startDate), parseISO(b.startDate))
                );
                scheduleCompleted.sort((a, b) =>
                    compareAsc(parseISO(b.updatedAt), parseISO(a.updatedAt))
                );
                noTimeCompleted.sort((a, b) =>
                    compareAsc(parseISO(b.updatedAt), parseISO(a.updatedAt))
                );

                const dayCounts = {
                    active: scheduleActive.length + noTimeActive.length,
                    completed: scheduleCompleted.length + noTimeCompleted.length,
                    all:
                        scheduleActive.length +
                        noTimeActive.length +
                        scheduleCompleted.length +
                        noTimeCompleted.length,
                };

                return res.status(200).json({
                    success: true,
                    message: 'Задачи получены (режим дня)',
                    data: {
                        todos: {
                            withDate: sortTodosForClient([...scheduleActive, ...scheduleCompleted]),
                            withoutDate: sortTodosForClient([...noTimeActive, ...noTimeCompleted]),
                        },
                        counts: dayCounts,
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
