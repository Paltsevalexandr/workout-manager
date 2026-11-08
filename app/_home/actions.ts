"use server";

import { z } from "zod";
import { ActionResult, idSchema, runMutation } from "@/lib/mutation";
import { archiveWorkout, createWorkout, softDeleteWorkout, unarchiveWorkout, updateWorkout, WorkoutDTO } from "@/data/workouts";

const workoutExerciseSchema = z.object({
    id: idSchema.nullable(),
    exerciseId: idSchema
});

const workoutSchema = z.object({
    name: z.string().trim().min(2).max(191),
    workoutExercises: z.array(
        workoutExerciseSchema
    ).min(1).max(100).refine(
        workoutExercises => {
            // Rows with the same id would overwrite each other's position
            const ids = workoutExercises.flatMap(
                row => row.id === null ? [] : [row.id]
            );
            return new Set(ids).size === ids.length;
        },
        "Workout exercises must be unique"
    ),
});

export async function createWorkoutAction(input: unknown): Promise<ActionResult<WorkoutDTO>> {
    const parsed = workoutSchema.safeParse(input);
    if (!parsed.success) {
        return { ok: false, error: "Invalid workout data" };
    }
    return runMutation(() => createWorkout(parsed.data));
}

export async function updateWorkoutAction(id: unknown, input: unknown): Promise<ActionResult<WorkoutDTO>> {
    const parsedId = idSchema.safeParse(id);
    const parsedInput = workoutSchema.safeParse(input);

    if (!parsedId.success || !parsedInput.success) {
        return {
            ok: false,
            error: "Invalid workout data"
        }
    }
    return runMutation(() => updateWorkout(parsedId.data, parsedInput.data));
}

export async function softDeleteWorkoutAction(id: unknown): Promise<ActionResult<void>> {
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) {
        return {
            ok: false,
            error: "Invalid workout data"
        }
    }
    return runMutation(() => softDeleteWorkout(parsedId.data));
}

export async function archiveWorkoutAction(id: unknown): Promise<ActionResult<void>> {
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) {
        return {
            ok: false,
            error: "Invalid workout id"
        };
    }
    return runMutation(() => archiveWorkout(parsedId.data));
}

export async function unarchiveWorkoutAction(id: unknown): Promise<ActionResult<void>> {
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) {
        return {
            ok: false,
            error: "Invalid workout id"
        };
    }
    return runMutation(() => unarchiveWorkout(parsedId.data));
}
