import { Exercise, WorkoutSession } from "../app/_types";

export function generateID<T extends { id: number | null }>(dataArr: T[]): number {
    const maxId = dataArr.reduce((max, item) => {
        if (item.id !== null && item.id > max) {
            return item.id;
        }
        return max;
    }, 0);

    return maxId + 1;
}

export function getExerciseById(exercises: Exercise[], id: number | null | undefined): Exercise | undefined {
    return exercises.find(exercise => exercise.id == id);
}

export function getLastSessionDate(templateId: number, sessions: WorkoutSession[]): number | null {
    const templateSessions = sessions.filter(s => s.workoutId === templateId);
    if (templateSessions.length === 0) return null;
    return Math.max(...templateSessions.map(s => s.date));
}

export function getLastSession(templateId: number, sessions: WorkoutSession[]): WorkoutSession | null {
    const templateSessions = sessions.filter(s => s.workoutId === templateId);
    return templateSessions.reduce((prev, current) => {
        if (!prev || current.date > prev.date) {
            return current;
        }
        return prev;
    }, null as WorkoutSession | null);
}
