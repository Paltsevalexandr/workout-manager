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

export function formatFullDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

export function dateStringToDateObj(datestr: string) {
    const [year, month, day] = datestr.split('-').map(Number);
    return new Date(year, month - 1, day);
}

export function formatRelativeDate(timestamp: number | null): string {
    if (timestamp == null) {
        return "Never done";
    }
    let text = "";
    const days = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
    if (days === 0) {
        text = "Today"
    }
    else if (days === 1) {
        text = "Yesterday"
    }
    else {
        text = `${days} days ago`;
        if (days > 14) {
            text = `2+ weeks ago`;
        }
    }
    return "Last done: " + text;
}
