import { PositionedTodo } from '../types/types';
import { getMinutesFromMidnight } from '../../lib/getMinutesFromMidnight';

export const calculatePosition = (
    timelineStartHour: number,
    startDateStr?: string,
    endDateStr?: string
): { top: number; height: number } | undefined => {
    if (!startDateStr && !endDateStr) return undefined;

    const timelineStartMinutes = timelineStartHour * 60;
    let startMinutes = 0;
    let endMinutes = 0;

    // Сценарий 1: Есть обе даты
    if (startDateStr && endDateStr) {
        startMinutes = getMinutesFromMidnight(startDateStr);
        endMinutes = getMinutesFromMidnight(endDateStr);
    }
    // Сценарий 2: Есть только старт (делаем задачу фиксированной длиной в 1 час)
    else if (startDateStr && !endDateStr) {
        startMinutes = getMinutesFromMidnight(startDateStr);
        endMinutes = startMinutes + 60;
    }
    // Сценарий 3: Есть только конец (делаем задачу длиной в 1 час, уходящую вверх)
    else if (!startDateStr && endDateStr) {
        endMinutes = getMinutesFromMidnight(endDateStr);
        startMinutes = Math.max(0, endMinutes - 60);
    }

    const top = startMinutes - timelineStartMinutes;
    const height = endMinutes - startMinutes;
    const finalHeight = height ? height : 40;

    return { top, height: finalHeight };
};

export const resolveOverlappingTodos = (
    todos: Omit<PositionedTodo, 'leftPercent' | 'widthPercent'>[]
): PositionedTodo[] => {
    const sorted = [...todos].sort((a, b) => a.top - b.top);
    const groups: Omit<PositionedTodo, 'leftPercent' | 'widthPercent'>[][] = [];

    sorted.forEach(todo => {
        const overlappingGroup = groups.find(group =>
            group.some(
                gtodo => todo.top < gtodo.top + gtodo.height && todo.top + todo.height > gtodo.top
            )
        );

        if (overlappingGroup) {
            overlappingGroup.push(todo);
        } else {
            groups.push([todo]);
        }
    });

    const result: PositionedTodo[] = [];

    groups.forEach(group => {
        const columnsCount = group.length;
        const width = 100 / columnsCount;

        group.forEach((todo, index) => {
            result.push({
                ...todo,
                widthPercent: width,
                leftPercent: index * width,
            });
        });
    });

    return result.sort((a, b) => a.top - b.top);
};
