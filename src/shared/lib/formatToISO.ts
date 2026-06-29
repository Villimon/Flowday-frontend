export const formatToBackendISO = (
    displayString: string | undefined | null
): string | undefined => {
    if (!displayString) return undefined;

    const [datePart, timePart] = displayString.split(' ');
    const [day, month, year] = datePart.split('.').map(Number);

    // Если время не указано, ставим полдень или полночь по дефолту
    const [hours, minutes] = timePart ? timePart.split(':').map(Number) : [0, 0];

    // Создаем дату (месяцы в JS идут от 0 до 11, поэтому month - 1)
    const date = new Date(year, month - 1, day, hours, minutes);

    return date.toISOString(); // На выходе получим "2026-06-27T16:00:00.000Z" (в UTC)
};
