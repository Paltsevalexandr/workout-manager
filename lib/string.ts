export function capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

// Trims the name and collapses runs of whitespace into one space, so names that
// look the same on screen ("Test  2" and "Test 2") are also equal for uniqueness checks
export function normalizeName(value: string) {
    return value.trim().replace(/\s+/g, " ");
}

export function getExercisesLabel(amount: number) {
    return `${amount} ${amount == 1 ? "exercise" : "exercises"}`
}
