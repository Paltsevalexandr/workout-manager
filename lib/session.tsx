import {
    PerformedExercise,
    PlannedExercise,
    SessionFormSource,
    Workout,
    PlannedSession,
    PerformedSession,
    Exercise,
    PerformedSessionDraft,
    PlannedSessionDraft,
    SessionExerciseDraft,
} from "../_types";
import { getExerciseById, getLastSession, getLatestPerformedExercise, getPlannedExercise, getLastPlan, isPlannedSession, isPerformedSession } from "./data";
import { Clock, AlertCircle, Dumbbell } from "lucide-react";

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

// Rows always come from the workout's currently active exercises.
// Values are taken from sourceSession, then from fallbackSession
// for rows the source doesn't have, then defaults
export function createSessionExercises(
    workout: Workout,
    sourceSession: PerformedSession | PlannedSession | null,
    exercises: Exercise[],
    fallbackSession: PerformedSession | PlannedSession | null = null
): SessionExerciseDraft[] {
    const sessionExercises: SessionExerciseDraft[] = [];

    workout.workoutExercises.forEach((workoutExercise) => {
        // skip rows whose exercise was itself deleted from the catalog —
        // the WorkoutExercise row can still be active while its exercise isn't
        const exercise = getExerciseById(exercises, workoutExercise.exerciseId);
        if (!exercise || exercise.isDeleted) {
            return;
        }
        sessionExercises.push(
            createSessionExercise(sourceSession, workoutExercise.id, fallbackSession)
        );
    });

    return sessionExercises;
}

export function buildPerformedSession(
    workout: Workout,
    performedSessions: PerformedSession[],
    plannedSessions: PlannedSession[],
    exercises: Exercise[],
    options?: { source?: SessionFormSource; date?: number }
): { session: PerformedSessionDraft; sessionFormSource: SessionFormSource } {
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
        workout, sessionSourceObj, exercises
    );

    return {
        session: {
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
    plannedSessions: PlannedSession[],
    exercises: Exercise[]
): { plan: PlannedSessionDraft; sessionFormSource: SessionFormSource } {
    const lastSession = getLastSession(workout.id, performedSessions);
    const existingPlan = getLastPlan(workout.id, plannedSessions);
    const sessionFormSource = getDefaultSessionSource(lastSession);

    // An existing plan is rebuilt against the current workout: rows removed from
    // the workout are dropped, newly added ones take values from the last session
    // (or defaults if the exercise was never performed)
    const plannedExercises = createSessionExercises(
        workout,
        existingPlan ?? lastSession,
        exercises,
        existingPlan ? lastSession : null
    );

    return {
        plan: {
            id: existingPlan?.id ?? null,
            workoutId: workout.id,
            date: existingPlan?.date ?? Date.now(),
            plannedExercises
        },
        sessionFormSource
    };
}

function findSourceExercise(
    source: PerformedSession | PlannedSession | null,
    workoutExerciseId: number
): PerformedExercise | PlannedExercise | null {
    return isPerformedSession(source)
        ? getLatestPerformedExercise(source, workoutExerciseId)
        : isPlannedSession(source)
            ? getPlannedExercise(source, workoutExerciseId)
            : null;
}

export function createSessionExercise(
    source: PerformedSession | PlannedSession | null,
    workoutExerciseId: number,
    fallback: PerformedSession | PlannedSession | null = null
): SessionExerciseDraft {
    const sourceExercise = findSourceExercise(source, workoutExerciseId)
        ?? findSourceExercise(fallback, workoutExerciseId);

    return {
        workoutExerciseId,
        sets: sourceExercise?.sets ?? 1,
        target: sourceExercise?.target ?? 1,
        weight: sourceExercise?.weight ?? 0,
        rest: sourceExercise?.rest ?? 1,
    };
}

export function getTargetLabel(exercise: Exercise | undefined) {
    return exercise?.targetType === "duration" ? "s" : "";
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
