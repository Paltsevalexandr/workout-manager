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
    const workoutSessions = sessions.filter(s => s.workoutId === workoutId);
    return workoutSessions.reduce((prev, current) => {
        if (!prev || current.date > prev.date) {
            return current;
        }
        return prev;
    }, null as PerformedSession | null);
}

export function getLastPlan(workoutId: number, plans: PlannedSession[]): PlannedSession | null {
    const workoutSessions = plans.filter(p => p.workoutId === workoutId);
    return workoutSessions.reduce((prev, current) => {
        if (!prev || current.date > prev.date) {
            return current;
        }
        return prev;
    }, null as PlannedSession | null)
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

export function getSourceExercises(session: PerformedSession | PlannedSession)
    : PerformedExercise[] | PlannedExercise[] {
    let sourceExercises: PerformedExercise[] | PlannedExercise[] =
        isPerformedSession(session)
            ? session.performedExercises
            : session.plannedExercises;
    return sourceExercises;

}

export function getLatestPerformedExercise(lastSession: PerformedSession | null, workoutExerciseId: number): PerformedExercise | null {
    return lastSession?.performedExercises.find(
        (ex) => ex.workoutExerciseId === workoutExerciseId
    ) ?? null;
}
export function getWorkoutExercise(id: WorkoutExercise["id"], workout: Workout): WorkoutExercise | null {
    return workout.workoutExercises.find(exercise => exercise.id == id) ?? null;
}
export function getWorkoutExercises(workout: Workout, exercises: Exercise[]): Exercise[] {
    return workout.workoutExercises
        .filter(we => !we.isDeleted)
        .map(we => getExerciseById(exercises, we.exerciseId))
        .filter((exercise): exercise is Exercise => exercise !== undefined && !exercise.isDeleted);
}
export function getPlannedExercise(plan: PlannedSession | null, workoutExerciseId: number): PlannedExercise | null {
    return plan?.plannedExercises.find(
        ex => ex.workoutExerciseId === workoutExerciseId
    ) ?? null
}

export function getMuscleGroupById(id: number, muscleGroups: MuscleGroup[]): MuscleGroup | null {
    return muscleGroups.find(group => group.id == id) ?? null;
}
