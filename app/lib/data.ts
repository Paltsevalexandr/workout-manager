export const dayNames: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

export function getDayName(day:number) {
    if (dayNames.length > day) {
        return dayNames[day];
    }
    return "Unknonwn";
}
