// Парсит внутренний формат datetime-local (YYYY-MM-DDTHH:mm) наружу в твой ДД.ММ.ГГГГ ЧЧ:ММ
export const formatToDisplay = (isoString: string): string => {
    if (!isoString) return '';

    // Если бэк или инпут вернул строку без времени (например, "2026-06-25")
    if (!isoString.includes('T')) {
        const [year, month, day] = isoString.split('-');
        return `${day}.${month}.${year}`; // Возвращаем только дату без времени
    }

    let cleanString = isoString.replace(/\.\d{3}Z$/, '');

    const parts = cleanString.split('T');

    if (parts.length === 2) {
        const timeParts = parts[1].split(':');
        if (timeParts.length >= 2) {
            cleanString = `${parts[0]} ${timeParts[0]}:${timeParts[1]}`;
        }
    }

    const [date, time] = cleanString.split(' ');
    const [year, month, day] = date.split('-');
    return `${day}.${month}.${year} ${time}`;
};
