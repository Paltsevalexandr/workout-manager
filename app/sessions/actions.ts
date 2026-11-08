"use server";

import { z } from "zod";
import { ActionResult, idSchema, runMutation } from "@/lib/mutation";
import { createPerformedSession, deletePerformedSession, PerformedSessionDTO, updatePerformedSession } from "@/data/performedSessions";
import { createPlannedSession, deletePlannedSession, PlannedSessionDTO, updatePlannedSession } from "@/data/plannedSessions";

const SessionExerciseSchema = z.object({
    workoutExerciseId: idSchema,
    sets: z.number().min(1).max(1000).int(),
    target: z.number().min(1).max(86400).int(),
    weight: z.number().min(0).max(1000),
    rest: z.number().min(0).max(3600).int(),
});

const SessionExercisesSchema = z.array(
    SessionExerciseSchema
).min(1).max(100).refine(
    checkExerciseDuplicates,
    "Workout exercises must be unique"
);

const PerformedSessionSchema = z.object({
    workoutId: idSchema,
    date: z.number().int()
        .min(Date.UTC(2000, 0, 1))
        .refine(date => {
            const maxDate = Date.now() + 24 * 3600 * 1000;
            return date <= maxDate;
        }, "The date can't be in the future"),
    performedExercises: SessionExercisesSchema
});

const PlannedSessionSchema = z.object({
    workoutId: idSchema,
    // Plans may be in the future, so only the range is limited
    date: z.number().int()
        .min(Date.UTC(2000, 0, 1))
        .max(Date.UTC(2100, 0, 1)),
    plannedExercises: SessionExercisesSchema
});

type SessionExercise = z.infer<typeof SessionExerciseSchema>;

function checkExerciseDuplicates(sessionExercises: SessionExercise[]): boolean {
    // The same exercise can't be logged twice in one session
    const ids = sessionExercises.map(row => row.workoutExerciseId);
    return new Set(ids).size === ids.length;
}

export async function createPerformedSessionAction(input: unknown): Promise<ActionResult<PerformedSessionDTO>> {
    const parsed = PerformedSessionSchema.safeParse(input);
    if (!parsed.success) {
        console.error(parsed.error.issues);
        return {
            ok: false,
            error: "Invalid session data"
        }
    }
    return runMutation(() => createPerformedSession(parsed.data));
}

export async function updatePerformedSessionAction(sessionId: unknown, input: unknown): Promise<ActionResult<PerformedSessionDTO>> {
    const parsedInput = PerformedSessionSchema.safeParse(input);
    const parsedId = idSchema.safeParse(sessionId);
    if (!parsedId.success || !parsedInput.success) {
        console.error(parsedId.error?.issues);
        console.error(parsedInput.error?.issues);
        return {
            ok: false,
            error: "Invalid session data"
        }
    }
    return runMutation(() => updatePerformedSession(parsedId.data, parsedInput.data));
}

export async function deletePerformedSessionAction(sessionId: unknown): Promise<ActionResult<void>> {
    const parsedId = idSchema.safeParse(sessionId);

    if (!parsedId.success) {
        console.error(parsedId.error?.issues);
        return {
            ok: false,
            error: "Invalid session id"
        }
    }
    return runMutation(() => deletePerformedSession(parsedId.data));
}

export async function createPlannedSessionAction(input: unknown): Promise<ActionResult<PlannedSessionDTO>> {
    const parsed = PlannedSessionSchema.safeParse(input);
    if (!parsed.success) {
        console.error(parsed.error.issues);
        return {
            ok: false,
            error: "Invalid session data"
        }
    }
    return runMutation(() => createPlannedSession(parsed.data));
}

export async function updatePlannedSessionAction(sessionId: unknown, input: unknown): Promise<ActionResult<PlannedSessionDTO>> {
    const parsedInput = PlannedSessionSchema.safeParse(input);
    const parsedId = idSchema.safeParse(sessionId);
    if (!parsedId.success || !parsedInput.success) {
        console.error(parsedId.error?.issues);
        console.error(parsedInput.error?.issues);
        return {
            ok: false,
            error: "Invalid session data"
        }
    }
    return runMutation(() => updatePlannedSession(parsedId.data, parsedInput.data));
}

export async function deletePlannedSessionAction(sessionId: unknown): Promise<ActionResult<void>> {
    const parsedId = idSchema.safeParse(sessionId);

    if (!parsedId.success) {
        console.error(parsedId.error?.issues);
        return {
            ok: false,
            error: "Invalid session id"
        }
    }
    return runMutation(() => deletePlannedSession(parsedId.data));
}

