import { Exercise, WorkoutSession } from "../_types";

export function generateID<T extends { id: number | null }>(dataArr: T[]): number {
    const maxId = dataArr.reduce((max, item) => {
        if (item.id !== null && item.id > max) {
            return item.id;
        }
        return max;
    }, -1);

    return maxId + 1;
}

export function getExerciseById(exercises: Exercise[], id: number) {
    return exercises.find(exercise => exercise.id == id);
}

export function getLastSessionDate(templateId: number, sessions: WorkoutSession[]): number | null {
    const templateSessions = sessions.filter(s => s.workoutId === templateId);
    if (templateSessions.length === 0) return null;
    return Math.max(...templateSessions.map(s => s.date));
}
