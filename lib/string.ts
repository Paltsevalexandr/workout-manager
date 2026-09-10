export function capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getExercisesLabel(amount: number) {
    return `${amount} ${amount == 1 ? "exercise" : "exercises"}`
}
