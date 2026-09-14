import { Exercise, PerformedExercise, PlannedExercise, WorkoutPlan, WorkoutSession } from "../_types";

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

export function getLastSession(workoutId: number, sessions: WorkoutSession[]): WorkoutSession | null {
    const templateSessions = sessions.filter(s => s.workoutId === workoutId);
    return templateSessions.reduce((prev, current) => {
        if (!prev || current.date > prev.date) {
            return current;
        }
        return prev;
    }, null as WorkoutSession | null);
}

export function getPlannedSession(workoutId: number, plans: WorkoutPlan[]): WorkoutPlan | null {
    return plans.find(plan => plan.workoutId === workoutId) ?? null;
}

export function isWorkoutSession(
    source: WorkoutSession | WorkoutPlan | null
): source is WorkoutSession {
    if (source === null) {
        return false;
    }
    return "performedExercises" in source;
}
export function isWorkoutPlan(
    source: WorkoutSession | WorkoutPlan | null
): source is WorkoutPlan {
    if (source === null) {
        return false;
    }
    return "plannedExercises" in source;
}

export function getLatestPerformedExercise(lastSession: WorkoutSession | null, workoutExerciseId: number): PerformedExercise | null {
    return lastSession?.performedExercises.find(
        (ex) => ex.workoutExerciseId === workoutExerciseId
    ) ?? null;
}
export function getPlannedExercise(plan: WorkoutPlan | null, workoutExerciseId: number): PlannedExercise | null {
    return plan?.plannedExercises.find(
        ex => ex.workoutExerciseId === workoutExerciseId
    ) ?? null
}
