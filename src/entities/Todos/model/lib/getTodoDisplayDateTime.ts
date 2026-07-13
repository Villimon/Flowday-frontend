import { Todo } from '@/entities/Todos/model/types/types';
import { parseISO, format, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';

export const getTodoDisplayDateTime = (todo: Todo): string => {
    if (!todo.startDate && !todo.endDate) return '';

    const start = todo.startDate ? parseISO(todo.startDate) : null;
    const end = todo.endDate ? parseISO(todo.endDate) : null;

    const hasStartTime = start ? start.getHours() !== 0 || start.getMinutes() !== 0 : false;
    const hasEndTime = end ? end.getHours() !== 0 || end.getMinutes() !== 0 : false;

    // === КЕЙС 1: ИЗОЛИРОВАННЫЕ ДАТЫ (Есть только что-то одно) ===

    // Есть только СТАРТ
    if (start && !end) {
        return hasStartTime
            ? format(start, 'd MMMM с HH:mm', { locale: ru })
            : format(start, 'd MMMM', { locale: ru });
    }

    // Есть только КОНЕЦ
    if (!start && end) {
        return hasEndTime
            ? format(end, 'd MMMM до HH:mm', { locale: ru })
            : format(end, 'd MMMM', { locale: ru });
    }

    // === КЕЙС 2: ЕСТЬ ОБЕ ДАТЫ (start и end гарантированно не null) ===
    const startDateTimeStr = hasStartTime
        ? format(start!, 'd MMMM HH:mm', { locale: ru })
        : format(start!, 'd MMMM', { locale: ru });

    // 2.1. Если старт и конец в один и тот же день
    if (isSameDay(start!, end!)) {
        if (hasEndTime) {
            // Если у старта не было времени, а у конца есть,
            // лучше вывести полный старт и время конца: "2 июля с 00:00" -> "2 июля 00:00 – 14:32"
            const baseStartStr = hasStartTime
                ? format(start!, 'd MMMM HH:mm', { locale: ru })
                : format(start!, 'd MMMM HH:mm', { locale: ru }); // Выведет 00:00 для наглядности интервала
            return `${baseStartStr} – ${format(end!, 'HH:mm')}`;
        }
        // Если время конца 00:00 в тот же день — показываем просто красивый старт
        return hasStartTime
            ? format(start!, 'd MMMM с HH:mm', { locale: ru })
            : format(start!, 'd MMMM', { locale: ru });
    }

    // 2.2. Если дни разные
    const endDateTimeStr = hasEndTime
        ? format(end!, 'd MMMM HH:mm', { locale: ru })
        : format(end!, 'd MMMM', { locale: ru });

    return `${startDateTimeStr} – ${endDateTimeStr}`;
};
