import "server-only";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import type { ExerciseTargetType } from "@/generated/prisma/client";
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

// Unique index over active exercise names, created by hand in a migration
const ACTIVE_NAME_INDEX = "Exercise_active_name_key";
const NAME_TAKEN_MESSAGE = "An exercise with this name already exists";

// assertNameIsFree is a fast check for the usual case, but it can't stop two
// concurrent requests with the same name; the unique index does, and this
// turns its violation into the same user-facing error
async function withNameConflictCheck<T>(mutation: () => Promise<T>): Promise<T> {
    try {
        return await mutation();
    } catch (error) {
        const isNameConflict =
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002" &&
            // The index name sits in the driver adapter's error details
            JSON.stringify(error.meta ?? {}).includes(ACTIVE_NAME_INDEX);
        if (isNameConflict) {
            throw new DataError(NAME_TAKEN_MESSAGE);
        }
        throw error;
    }
}

async function assertNameIsFree(name: string, exceptId?: number) {
    const count = await prisma.exercise.count({
        where: {
            name,
            deletedAt: null,
            id: exceptId === undefined ? undefined : { not: exceptId },
        },
    });
    if (count > 0) {
        throw new DataError(NAME_TAKEN_MESSAGE);
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

// An exercise can't become its own ancestor: walk up from the new parent
// and fail if the chain reaches the edited exercise
async function assertNoParentCycle(id: number, parentId: number | null) {
    const visited = new Set<number>();
    let currentId = parentId;
    while (currentId !== null && !visited.has(currentId)) {
        if (currentId === id) {
            throw new DataError("An exercise can't be its own parent or a parent of its parent");
        }
        visited.add(currentId);
        const current = await prisma.exercise.findUnique({
            where: { id: currentId },
            select: { parentId: true },
        });
        currentId = current?.parentId ?? null;
    }
}

// Prisma's `connect` throws a non-DataError for unknown ids, so check them upfront
async function assertRelationsExist(categoryIds: number[], muscleGroupIds: number[]) {
    const [categoryCount, muscleGroupCount] = await Promise.all([
        prisma.category.count({ where: { id: { in: categoryIds } } }),
        prisma.muscleGroup.count({ where: { id: { in: muscleGroupIds } } }),
    ]);
    if (categoryCount !== new Set(categoryIds).size) {
        throw new DataError("One or more selected categories don't exist");
    }
    if (muscleGroupCount !== new Set(muscleGroupIds).size) {
        throw new DataError("One or more selected muscle groups don't exist");
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
    await assertRelationsExist(input.categoryIds, input.muscleGroupIds);

    const row = await withNameConflictCheck(() => prisma.exercise.create({
        data: {
            name: input.name,
            targetType: input.targetType,
            parentId: input.parentId,
            categories: { connect: input.categoryIds.map((id) => ({ id })) },
            muscleGroups: { connect: input.muscleGroupIds.map((id) => ({ id })) },
        },
        select: exerciseSelect,
    }));
    return toExerciseDTO(row);
}

export async function updateExercise(id: number, input: ExerciseInput): Promise<ExerciseDTO> {
    await getEditableExercise(id);
    await assertNameIsFree(input.name, id);
    await assertParentIsActive(input.parentId);
    await assertNoParentCycle(id, input.parentId);
    await assertRelationsExist(input.categoryIds, input.muscleGroupIds);

    const row = await withNameConflictCheck(() => prisma.exercise.update({
        where: { id },
        data: {
            name: input.name,
            targetType: input.targetType,
            parentId: input.parentId,
            categories: { set: input.categoryIds.map((categoryId) => ({ id: categoryId })) },
            muscleGroups: { set: input.muscleGroupIds.map((muscleGroupId) => ({ id: muscleGroupId })) },
        },
        select: exerciseSelect,
    }));
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
