import { Todo } from '../types/types';
import {
    isBefore,
    isAfter,
    isSameDay,
    isWithinInterval,
    startOfDay,
    endOfDay,
    endOfWeek,
} from 'date-fns';

// Типизируем только те ключи, которые отвечают за группы списков
export type TodoListCategory = 'overdue' | 'today' | 'thisWeek' | 'upcoming' | 'withoutDate';

export const getTodoCategory = (todo: Todo): TodoListCategory => {
    // 1. withoutDate — задачи без дат
    if (!todo.startDate && !todo.endDate) {
        return 'withoutDate';
    }

    const today = startOfDay(new Date());
    const weekEnd = endOfDay(endOfWeek(today, { weekStartsOn: 1 }));

    const todoStart = todo.startDate ? startOfDay(new Date(todo.startDate)) : null;
    const todoEnd = todo.endDate ? endOfDay(new Date(todo.endDate)) : null;

    // 2. overdue — endDate < сегодня
    if (todoEnd && isBefore(todoEnd, today)) {
        return 'overdue';
    }

    // 3. today — старт/конец сегодня или текущий день внутри диапазона
    const isStartToday = todoStart && isSameDay(todoStart, today);
    const isEndToday = todoEnd && isSameDay(todoEnd, today);
    const isTodayInsideRange =
        todoStart && todoEnd && isWithinInterval(today, { start: todoStart, end: todoEnd });

    if (isStartToday || isEndToday || isTodayInsideRange) {
        return 'today';
    }

    // 4. upcoming — старт позже этой недели
    if (todoStart && isAfter(todoStart, weekEnd)) {
        return 'upcoming';
    }

    // 5. thisWeek — все остальные случаи (на текущей неделе)
    return 'thisWeek';
};
