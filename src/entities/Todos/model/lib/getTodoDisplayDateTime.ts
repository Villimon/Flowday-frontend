import { Todo } from '@/entities/Todos/model/types/types';
import { parseISO, format, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';

export const getTodoDisplayDateTime = (todo: Todo): string => {
    if (!todo.startDate) return '';

    const start = parseISO(todo.startDate);
    const end = todo.endDate ? parseISO(todo.endDate) : null;

    const hasStartTime = start.getHours() !== 0 || start.getMinutes() !== 0;
    const hasEndTime = end ? end.getHours() !== 0 || end.getMinutes() !== 0 : false;

    const startDateTimeStr = format(start, 'd MMMM HH:mm', { locale: ru });

    if (!hasStartTime) {
        const startDayStr = format(start, 'd MMMM', { locale: ru });

        if (end && !isSameDay(start, end)) {
            const endDayStr = hasEndTime
                ? format(end, 'd MMMM HH:mm', { locale: ru }) // Если у конца есть время
                : format(end, 'd MMMM', { locale: ru }); // Если у конца тоже 00:00
            return `${startDayStr} – ${endDayStr}`;
        }

        return startDayStr;
    }

    if (end) {
        // 1. Если старт и конец в один день
        if (isSameDay(start, end)) {
            if (hasEndTime) {
                return `${startDateTimeStr} – ${format(end, 'HH:mm')}`; // "2 июля 05:00 – 14:32"
            }
            return startDateTimeStr; // Если время конца 00:00 в тот же день — показываем просто старт
        }

        // 2. Если дни разные
        if (hasEndTime) {
            // Если у конца есть нормальное время
            const endDateTimeStr = format(end, 'd MMMM HH:mm', { locale: ru });
            return `${startDateTimeStr} – ${endDateTimeStr}`; // "30 июня 04:00 – 2 июля 06:00"
        } else {
            const endDayStr = format(end, 'd MMMM', { locale: ru });
            return `${startDateTimeStr} – ${endDayStr}`; // "3 июля 17:34 – 5 июля"
        }
    }

    return startDateTimeStr;
};
