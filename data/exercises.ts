import "server-only";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { categorySelect } from "@/data/categories";
import { muscleGroupSelect } from "@/data/muscleGroups";

const exerciseSelect = {
    id: true,
    name: true,
    targetType: true,
    parentId: true,
    isSystem: true,
    deletedAt: true,

    categories: { select: categorySelect, orderBy: { id: "asc" } },
    muscleGroups: { select: muscleGroupSelect, orderBy: { id: "asc" } },
} satisfies Prisma.ExerciseSelect;

type ExerciseRow = Prisma.ExerciseGetPayload<{ select: typeof exerciseSelect }>;

// What the UI gets: isDeleted instead of deletedAt
export type ExerciseDTO = Omit<ExerciseRow, "deletedAt"> & { isDeleted: boolean };

function toExerciseDTO({ deletedAt, ...exercise }: ExerciseRow): ExerciseDTO {
    return { ...exercise, isDeleted: deletedAt !== null };
}

export async function getExercises(): Promise<ExerciseDTO[]> {
    const rows = await prisma.exercise.findMany({
        select: exerciseSelect,
        orderBy: { id: "asc" },
    });
    return rows.map(toExerciseDTO);
}
