export const dayNames: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

export function getDayName(day: number) {
    if (dayNames.length > day) {
        return dayNames[day];
    }
    return "Unknonwn";
}

export function getFormattedDate(timestamp: number) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // +1, т.к. месяцы с 0
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
