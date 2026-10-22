import "server-only";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

const muscleGroupSelect = {
    id: true,
    name: true,
    isSystem: true,
    parentId: true,
} satisfies Prisma.MuscleGroupSelect;

export type MuscleGroupDTO = Prisma.MuscleGroupGetPayload<{ select: typeof muscleGroupSelect }>;

export async function getMuscleGroups(): Promise<MuscleGroupDTO[]> {
    return prisma.muscleGroup.findMany({
        select: muscleGroupSelect,
        orderBy: { id: "asc" }
    });
}
