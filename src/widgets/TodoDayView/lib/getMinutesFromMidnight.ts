import { getHours, getMinutes } from 'date-fns';

export const getMinutesFromMidnight = (date: string | number): number => {
    const newDate = new Date(String(date));
    const hours = getHours(newDate);
    const minutes = getMinutes(newDate);

    // Если это ровно 00:00 (полночь следующего дня),
    // возвращаем 1440 минут (24 часа), чтобы задача заполнила день до самого конца
    if (hours === 0 && minutes === 0) {
        return 24 * 60; // 1440
    }

    return hours * 60 + minutes;
};
