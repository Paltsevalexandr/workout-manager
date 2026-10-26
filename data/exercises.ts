import "server-only";
import { prisma } from "@/lib/prisma";
import type { Prisma, ExerciseTargetType } from "@/generated/prisma/client";
import { categorySelect } from "@/data/categories";
import { muscleGroupSelect } from "@/data/muscleGroups";
import { DataError } from "@/data/errors";

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

export type ExerciseInput = {
    name: string;
    targetType: ExerciseTargetType;
    parentId: number | null;
    categoryIds: number[];
    muscleGroupIds: number[];
};

async function assertNameIsFree(name: string, exceptId?: number) {
    const count = await prisma.exercise.count({
        where: {
            name,
            deletedAt: null,
            id: exceptId === undefined ? undefined : { not: exceptId },
        },
    });
    if (count > 0) {
        throw new DataError("An exercise with this name already exists");
    }
}

async function assertParentIsActive(parentId: number | null) {
    if (parentId === null) return;
    const parent = await prisma.exercise.findUnique({
        where: { id: parentId },
        select: { deletedAt: true },
    });
    if (!parent || parent.deletedAt !== null) {
        throw new DataError("The parent exercise doesn't exist or was deleted");
    }
}

async function getEditableExercise(id: number) {
    const exercise = await prisma.exercise.findUnique({
        where: { id },
        select: { isSystem: true, deletedAt: true },
    });
    if (!exercise || exercise.deletedAt !== null) {
        throw new DataError("Exercise not found");
    }
    if (exercise.isSystem) {
        throw new DataError("System exercises can't be changed");
    }
    return exercise;
}

export async function createExercise(input: ExerciseInput): Promise<ExerciseDTO> {
    await assertNameIsFree(input.name);
    await assertParentIsActive(input.parentId);

    const row = await prisma.exercise.create({
        data: {
            name: input.name,
            targetType: input.targetType,
            parentId: input.parentId,
            categories: { connect: input.categoryIds.map((id) => ({ id })) },
            muscleGroups: { connect: input.muscleGroupIds.map((id) => ({ id })) },
        },
        select: exerciseSelect,
    });
    return toExerciseDTO(row);
}

export async function updateExercise(id: number, input: ExerciseInput): Promise<ExerciseDTO> {
    await getEditableExercise(id);
    await assertNameIsFree(input.name, id);
    await assertParentIsActive(input.parentId);

    const row = await prisma.exercise.update({
        where: { id },
        data: {
            name: input.name,
            targetType: input.targetType,
            parentId: input.parentId,
            categories: { set: input.categoryIds.map((categoryId) => ({ id: categoryId })) },
            muscleGroups: { set: input.muscleGroupIds.map((muscleGroupId) => ({ id: muscleGroupId })) },
        },
        select: exerciseSelect,
    });
    return toExerciseDTO(row);
}

export async function softDeleteExercise(id: number): Promise<void> {
    await getEditableExercise(id);

    const activeChildren = await prisma.exercise.count({
        where: { parentId: id, deletedAt: null },
    });
    if (activeChildren > 0) {
        throw new DataError("This exercise is a parent of other exercises");
    }

    await prisma.exercise.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
}
