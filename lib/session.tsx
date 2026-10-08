import {
    PerformedExercise,
    PlannedExercise,
    SessionFormSource,
    Workout,
    PlannedSession,
    PerformedSession,
    Exercise,
} from "../_types";
import { generateID, getLastSession, getLatestPerformedExercise, getPlannedExercise, getLastPlan, isPlannedSession, isPerformedSession } from "./data";
import { Clock, AlertCircle, Dumbbell } from "lucide-react";

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
        if (workoutExercise.id !== null && !workoutExercise.isDeleted) {
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
    const currentPlannedSession = getLastPlan(workout.id, plannedSessions);

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

export function getTargetLabel(exercise: Exercise | undefined) {
    return exercise?.target === "duration" ? "s" : "";
}

export type SessionRecency = "none" | "recent" | "longAgo";

export function getSessionRecency(lastSessionDate: number | null): SessionRecency {
    if (lastSessionDate == null) {
        return "none";
    }

    const week = 1000 * 60 * 60 * 24 * 7;
    return lastSessionDate + week < Date.now() ? "longAgo" : "recent";
}

export function getLastSessionIcon(lastSessionDate: number | null, size: number = 16) {
    switch (getSessionRecency(lastSessionDate)) {
        case "none": return <Clock size={size} />;
        case "longAgo": return <AlertCircle size={size} />;
        case "recent": return <Dumbbell size={size} />;
    }
}

export function getLastSessionClass(
    lastSessionDate: number | null, styles: { readonly [key: string]: string; }
) {
    switch (getSessionRecency(lastSessionDate)) {
        case "none": return "";
        case "longAgo": return styles.workoutLastDateLongAgo;
        case "recent": return styles.workoutLastDateRecent;
    }
}
