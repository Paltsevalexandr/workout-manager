import { Exercise, MuscleGroup, PerformedExercise, PlannedExercise, PlannedSession, Workout, WorkoutExercise, PerformedSession } from "../_types";

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

export function getLastSessionDate(templateId: number, sessions: PerformedSession[]): number | null {
    const templateSessions = sessions.filter(s => s.workoutId === templateId);
    if (templateSessions.length === 0) return null;
    return Math.max(...templateSessions.map(s => s.date));
}

export function getLastSession(workoutId: number, sessions: PerformedSession[]): PerformedSession | null {
    const templateSessions = sessions.filter(s => s.workoutId === workoutId);
    return templateSessions.reduce((prev, current) => {
        if (!prev || current.date > prev.date) {
            return current;
        }
        return prev;
    }, null as PerformedSession | null);
}

export function getPlannedSession(workoutId: number, plans: PlannedSession[]): PlannedSession | null {
    return plans.find(plan => plan.workoutId === workoutId) ?? null;
}

export function isPerformedSession(
    source: PerformedSession | PlannedSession | null
): source is PerformedSession {
    if (source === null) {
        return false;
    }
    return "performedExercises" in source;
}
export function isPlannedSession(
    source: PerformedSession | PlannedSession | null
): source is PlannedSession {
    if (source === null) {
        return false;
    }
    return "plannedExercises" in source;
}

export function getLatestPerformedExercise(lastSession: PerformedSession | null, workoutExerciseId: number): PerformedExercise | null {
    return lastSession?.performedExercises.find(
        (ex) => ex.workoutExerciseId === workoutExerciseId
    ) ?? null;
}
export function getWorkoutExercise(id: WorkoutExercise["id"], workout: Workout): WorkoutExercise | null {
    return workout.workoutExercises.find(exercise => exercise.id == id) ?? null;
}
export function getPlannedExercise(plan: PlannedSession | null, workoutExerciseId: number): PlannedExercise | null {
    return plan?.plannedExercises.find(
        ex => ex.workoutExerciseId === workoutExerciseId
    ) ?? null
}

export function getMuscleGroupById(id: number, muscleGroups: MuscleGroup[]): MuscleGroup | null {
    return muscleGroups.find(group => group.id == id) ?? null;
}
