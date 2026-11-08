"use server";

import { z } from "zod";
import { ExerciseTargetType } from "@/generated/prisma/enums";
import { createExercise, deleteExercise, ExerciseDTO, updateExercise } from "@/data/exercises";
import { ActionResult, idSchema, runMutation } from "@/lib/mutation";

const exerciseInputSchema = z.object({
    name: z.string().trim().min(1).max(191),
    targetType: z.enum(ExerciseTargetType),
    parentId: idSchema.nullable(),
    categoryIds: z.array(idSchema).min(1),
    muscleGroupIds: z.array(idSchema).min(1),
});

export async function createExerciseAction(input: unknown): Promise<ActionResult<ExerciseDTO>> {
    const parsed = exerciseInputSchema.safeParse(input);
    if (!parsed.success) {
        return { ok: false, error: "Invalid exercise data" };
    }
    return runMutation(() => createExercise(parsed.data));
}

export async function updateExerciseAction(id: unknown, input: unknown): Promise<ActionResult<ExerciseDTO>> {
    const parsedId = idSchema.safeParse(id);
    const parsedInput = exerciseInputSchema.safeParse(input);
    if (!parsedId.success || !parsedInput.success) {
        return { ok: false, error: "Invalid exercise data" };
    }
    return runMutation(() => updateExercise(parsedId.data, parsedInput.data));
}

export async function deleteExerciseAction(id: unknown): Promise<ActionResult<ExerciseDTO | null>> {
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) {
        return { ok: false, error: "Invalid exercise id" };
    }
    return runMutation(() => deleteExercise(parsedId.data));
}
