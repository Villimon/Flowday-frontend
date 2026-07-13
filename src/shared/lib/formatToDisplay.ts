import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
// Парсит внутренний формат datetime-local (YYYY-MM-DDTHH:mm) наружу в твой ДД.ММ.ГГГГ ЧЧ:ММ
export const formatToDisplay = (isoString: string): string => {
    if (!isoString) return '';

    // Если бэк или инпут вернул строку без времени (например, "2026-06-25")
    if (!isoString.includes('T')) {
        const [year, month, day] = isoString.split('-');
        return `${day}.${month}.${year}`; // Возвращаем только дату без времени
    }

    const utcDate = parseISO(isoString);

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const zonedDate = toZonedTime(utcDate, userTimeZone || 'UTC');

    return format(zonedDate, 'dd.MM.yyyy HH:mm');
};
