import { TodoDayData } from '@/entities/Todos/model/types/types';
import { getMinutesFromMidnight } from '../../lib/getMinutesFromMidnight';
import { calculatePosition, resolveOverlappingTodos } from '../helpers/helpers';
import { PositionedTodo } from '../types/types';

export const useDayTimelineData = (todos?: TodoDayData) => {
    if (!todos?.withDate || todos.withDate.length === 0) {
        return { totalHours: 16, startHour: 7, endHour: 23, finalTodosToRender: [] };
    }

    const { minMinutes, maxMinutes } = todos.withDate.reduce(
        (acc, todo) => {
            if (!todo.startDate && !todo.endDate) return acc;

            let startTodoMinutes = acc.minMinutes;
            let endTodoMinutes = acc.maxMinutes;

            if (todo.startDate && todo.endDate) {
                startTodoMinutes = getMinutesFromMidnight(todo.startDate);
                endTodoMinutes = getMinutesFromMidnight(todo.endDate);
            }
            // Если есть только старт — закладываем +60 минут (1 час)
            else if (todo.startDate && !todo.endDate) {
                startTodoMinutes = getMinutesFromMidnight(todo.startDate);
                endTodoMinutes = startTodoMinutes + 60;
            }
            // Если есть только конец — закладываем -60 минут
            else if (!todo.startDate && todo.endDate) {
                endTodoMinutes = getMinutesFromMidnight(todo.endDate);
                startTodoMinutes = Math.max(0, endTodoMinutes - 60);
            }

            return {
                minMinutes: Math.min(acc.minMinutes, startTodoMinutes),
                maxMinutes: Math.max(acc.maxMinutes, endTodoMinutes),
            };
        },
        { minMinutes: 7 * 60, maxMinutes: 23 * 60 }
    );

    // Мин и макс время для графика дня в часах
    const startHour = Math.floor(minMinutes / 60);
    const endHour = Math.ceil(maxMinutes / 60);
    const totalHours = endHour - startHour;

    // Предварительный расчет координат
    const positionedTodos = todos.withDate
        .map(todo => {
            const coords = calculatePosition(startHour, todo.startDate, todo.endDate);
            if (!coords) return null;
            return {
                ...todo,
                top: coords.top,
                height: coords.height,
            };
        })
        .filter(Boolean) as Omit<PositionedTodo, 'leftPercent' | 'widthPercent'>[];

    // Распределяем колонки
    const finalTodosToRender = resolveOverlappingTodos(positionedTodos);

    return {
        totalHours,
        startHour,
        endHour,
        finalTodosToRender,
    };
};
