import { Exercise, Workout } from "../_types";

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

export function generateID(dataArr:Array<Workout|Exercise>) {
    let id = 0;
    
    if (dataArr.length > 0) {
        const sortedDataArr = dataArr.toSorted((a, b) => b.id - a.id);
        id = sortedDataArr[0].id + 1;
    }
    return id;
}
