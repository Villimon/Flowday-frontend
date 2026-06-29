// Парсит внешний формат ДД.ММ.ГГГГ ЧЧ:ММ внутрь для datetime-local
export const formatToValue = (displayString: string): string => {
    if (!displayString) return '';

    const [date, time] = displayString.split(' ');

    // Если передали только дату "25.06.2026" (без времени)
    if (!time) {
        const [day, month, year] = date.split('.');
        // Для datetime-local нужно дефолтное время, либо инпут отобразит пустые прочерки времени
        return `${year}-${month}-${day}T00:00`;
    }

    const [day, month, year] = date.split('.');
    return `${year}-${month}-${day}T${time}`;
};
