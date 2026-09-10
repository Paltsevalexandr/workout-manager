export function getStatusClass(
    lastSessionDate: number | null, styles: { readonly [key: string]: string; }
) {
    let lastSessionClass = "";
    if (lastSessionDate != null) {
        const week = 1000 * 60 * 60 * 24 * 7;

        if (lastSessionDate + week < Date.now()) { // long time ago
            lastSessionClass = styles.workoutLastDateLongAgo;
        }
        else {
            lastSessionClass = styles.workoutLastDateRecent;
        }
    }
    return lastSessionClass;
}
