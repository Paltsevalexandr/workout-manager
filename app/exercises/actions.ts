"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ExerciseTargetType } from "@/generated/prisma/enums";
import { DataError } from "@/data/errors";
import { createExercise, softDeleteExercise, updateExercise } from "@/data/exercises";

const idSchema = z.number().int().positive();

const exerciseInputSchema = z.object({
    name: z.string().trim().min(1).max(191),
    targetType: z.enum(ExerciseTargetType),
    parentId: idSchema.nullable(),
    categoryIds: z.array(idSchema).min(1),
    muscleGroupIds: z.array(idSchema).min(1),
});

export type ActionResult = { ok: true } | { ok: false; error: string };

// Runs a DAL mutation: expected errors go back to the UI, unexpected ones are rethrown
async function runMutation(mutation: () => Promise<unknown>): Promise<ActionResult> {
    try {
        await mutation();
    } catch (error) {
        if (error instanceof DataError) {
            return { ok: false, error: error.message };
        }
        throw error;
    }
    revalidatePath("/", "layout");
    return { ok: true };
}

export async function createExerciseAction(input: unknown): Promise<ActionResult> {
    const parsed = exerciseInputSchema.safeParse(input);
    if (!parsed.success) {
        return { ok: false, error: "Invalid exercise data" };
    }
    return runMutation(() => createExercise(parsed.data));
}

export async function updateExerciseAction(id: unknown, input: unknown): Promise<ActionResult> {
    const parsedId = idSchema.safeParse(id);
    const parsed = exerciseInputSchema.safeParse(input);
    if (!parsedId.success || !parsed.success) {
        return { ok: false, error: "Invalid exercise data" };
    }
    return runMutation(() => updateExercise(parsedId.data, parsed.data));
}

export async function deleteExerciseAction(id: unknown): Promise<ActionResult> {
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) {
        return { ok: false, error: "Invalid exercise id" };
    }
    return runMutation(() => softDeleteExercise(parsedId.data));
}
