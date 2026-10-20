export const dayNames: string[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
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
    const month = String(date.getMonth() + 1).padStart(2, "0"); // +1, т.к. месяцы с 0
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function formatFullDate(timestamp: number, fullMonth?: boolean): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
        month: fullMonth ? "long" : "short",
        day: "numeric",
        year: "numeric",
    });
}

export function dateStringToDateObj(datestr: string) {
    const [year, month, day] = datestr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    // new Date() maps years 0-99 to 1900-1999, setFullYear keeps the year as is
    date.setFullYear(year);
    return date;
}

export function formatRelativeDate(timestamp: number | null): string {
    if (timestamp == null) {
        return "Never done";
    }
    let text = "";
    // Count calendar days between local midnights, not 24-hour windows:
    // a session done yesterday at 22:00 is "Yesterday" at 08:00 today.
    // Math.round absorbs the 23/25-hour days around DST switches
    const startOfDay = (time: number) => new Date(time).setHours(0, 0, 0, 0);
    const days = Math.round((startOfDay(Date.now()) - startOfDay(timestamp)) / (1000 * 60 * 60 * 24));
    if (days === 0) {
        text = "Today"
    }
    else if (days === 1) {
        text = "Yesterday"
    }
    else {
        text = `${days} days ago`;
        if (days > 14) {
            text = "2+ weeks ago";
        }
    }
    return "Last done: " + text;
}
