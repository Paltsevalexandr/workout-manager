import {
    PerformedExercise,
    PlannedExercise,
    SessionFormSource,
    Workout,
    PlannedSession,
    PerformedSession,
} from "../_types";
import { generateID, getLastSession, getLatestPerformedExercise, getPlannedExercise, getPlannedSession, isPlannedSession, isPerformedSession } from "./data";

export function getAllPerformedExercises(sessions: PerformedSession[]): PerformedExercise[] {
    return sessions.flatMap(session => session.performedExercises);
}

export function getAllPlannedExercises(plans: PlannedSession[]): PlannedExercise[] {
    return plans.flatMap(plan => plan.plannedExercises);
}

export function getDefaultSessionSource(
    lastSession: PerformedSession | null,
    currentPlannedSession?: PlannedSession | null
): SessionFormSource {
    if (currentPlannedSession) {
        return "plan";
    }
    if (lastSession) {
        return "prevSession";
    }
    return "none";
}

export function createSessionExercises(
    workout: Workout,
    sourceSession: PerformedSession | PlannedSession | null,
    newSessionExerciseId: number
): PerformedExercise[] | PlannedExercise[] {
    const sessionExercises: (PerformedExercise | PlannedExercise)[] = [];

    workout.workoutExercises.forEach((workoutExercise, index) => {
        if (workoutExercise.id !== null) {
            sessionExercises.push(
                createSessionExercise(sourceSession, newSessionExerciseId + index, workoutExercise.id)
            );
        }
    });

    return sessionExercises as PerformedExercise[] | PlannedExercise[];
}

export function buildPerformedSession(
    workout: Workout,
    performedSessions: PerformedSession[],
    plannedSessions: PlannedSession[],
    options?: { source?: SessionFormSource; date?: number }
): { session: PerformedSession; sessionFormSource: SessionFormSource } {
    const newPerformedExerciseId = generateID(getAllPerformedExercises(performedSessions));

    const lastSession = getLastSession(workout.id, performedSessions);
    const currentPlannedSession = getPlannedSession(workout.id, plannedSessions);

    let sessionFormSource = getDefaultSessionSource(lastSession, currentPlannedSession);
    let sessionSourceObj: PerformedSession | PlannedSession | null = currentPlannedSession ?? lastSession;
    if (options?.source) {
        sessionFormSource = options.source;
        switch (sessionFormSource) {
            case "plan":
                sessionSourceObj = currentPlannedSession;
                break;
            case "prevSession":
                sessionSourceObj = lastSession;
                break;
        }
    }

    const performedExercises = createSessionExercises(
        workout, sessionSourceObj, newPerformedExerciseId
    ) as PerformedExercise[];

    return {
        session: {
            id: null,
            workoutId: workout.id,
            date: options?.date ?? Date.now(),
            performedExercises
        },
        sessionFormSource
    };
}

export function buildPlannedSession(
    workout: Workout,
    performedSessions: PerformedSession[],
    plannedSessions: PlannedSession[]
): { plan: PlannedSession; sessionFormSource: SessionFormSource } {
    const newPlannedExerciseId = generateID(getAllPlannedExercises(plannedSessions));

    const lastSession = getLastSession(workout.id, performedSessions);
    const sessionFormSource = getDefaultSessionSource(lastSession);

    const plannedExercises = createSessionExercises(
        workout, lastSession, newPlannedExerciseId
    ) as PlannedExercise[];

    return {
        plan: {
            id: null,
            workoutId: workout.id,
            date: Date.now(),
            plannedExercises
        },
        sessionFormSource
    };
}

export function createSessionExercise(
    source: PerformedSession | PlannedSession | null,
    newObjectId: number,
    workoutExerciseId: number
): PerformedExercise | PlannedExercise {
    const sourceExercise = isPerformedSession(source)
        ? getLatestPerformedExercise(source, workoutExerciseId)
        : isPlannedSession(source)
            ? getPlannedExercise(source, workoutExerciseId)
            : null;

    return {
        id: newObjectId,
        workoutExerciseId,
        sets: sourceExercise?.sets ?? 1,
        target: sourceExercise?.target ?? 1,
        weight: sourceExercise?.weight ?? 0,
        rest: sourceExercise?.rest ?? 1,
    };
}
