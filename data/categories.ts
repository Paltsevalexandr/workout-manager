import "server-only";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

const categorySelect = {
    id: true,
    name: true,
    isSystem: true,
} satisfies Prisma.CategorySelect;

export type CategoryDTO = Prisma.CategoryGetPayload<{ select: typeof categorySelect }>;

export async function getCategories(): Promise<CategoryDTO[]> {
    return prisma.category.findMany({
        select: categorySelect,
        orderBy: { id: "asc" },
    });
}
