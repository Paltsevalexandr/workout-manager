import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";
import { ExerciseTargetType } from "../generated/prisma/client";

// The seed runs outside Next.js, so it can't import lib/prisma.ts (server-only)
const prisma = new PrismaClient({
    adapter: new PrismaMariaDb(process.env.DATABASE_URL!),
});

const categoryNames = [
    "strength", "cardio", "mobility", "stretching",
    "stamina", "recovery", "balance", "plyometric",
];

// Parent group -> its child groups
const muscleGroupTree: Record<string, string[]> = {
    Chest: ["Upper Chest", "Lower Chest"],
    Back: ["Lats", "Upper Back", "Traps", "Lower Back"],
    Shoulders: ["Front Delts", "Side Delts", "Rear Delts"],
    Arms: ["Biceps", "Triceps", "Forearms"],
    Core: ["Abs", "Obliques"],
    Legs: ["Quadriceps", "Hamstrings", "Glutes", "Calves", "Adductors"],
};

type SeedExercise = {
    name: string;
    targetType: ExerciseTargetType;
    categories: string[];
    muscleGroups: string[];
};

const exercises: SeedExercise[] = [
    { name: "Push-ups", targetType: "reps", categories: ["strength"], muscleGroups: ["Chest"] },
    { name: "Barbell squat", targetType: "reps", categories: ["strength"], muscleGroups: ["Legs"] },
    { name: "Running", targetType: "duration", categories: ["cardio"], muscleGroups: ["Legs"] },
    { name: "Dumbbell row", targetType: "reps", categories: ["strength"], muscleGroups: ["Back"] },
    { name: "Plank", targetType: "duration", categories: ["mobility"], muscleGroups: ["Core"] },
    { name: "Lunges", targetType: "reps", categories: ["stretching"], muscleGroups: ["Legs"] },
];

async function main() {
    // The seed is meant for an empty database
    if (await prisma.category.count() > 0) {
        console.log("Database is not empty, seed skipped.");
        return;
    }

    // 1. Categories: many rows in one query
    await prisma.category.createMany({
        data: categoryNames.map((name) => ({ name, isSystem: true })),
    });

    // 2. Muscle groups: each parent is created together with its children
    for (const [parentName, childNames] of Object.entries(muscleGroupTree)) {
        await prisma.muscleGroup.create({
            data: {
                name: parentName,
                isSystem: true,
                children: {
                    create: childNames.map((name) => ({ name, isSystem: true })),
                },
            },
        });
    }

    // 3. Exercises: link to existing categories and muscle groups by id
    const categoryIds = await getIdsByName(prisma.category.findMany());
    const muscleGroupIds = await getIdsByName(prisma.muscleGroup.findMany());

    for (const exercise of exercises) {
        await prisma.exercise.create({
            data: {
                name: exercise.name,
                targetType: exercise.targetType,
                isSystem: true,
                categories: {
                    connect: exercise.categories.map((name) => ({ id: categoryIds.get(name)! })),
                },
                muscleGroups: {
                    connect: exercise.muscleGroups.map((name) => ({ id: muscleGroupIds.get(name)! })),
                },
            },
        });
    }

    console.log("Seed finished.");
}

async function getIdsByName(rowsPromise: Promise<{ id: number; name: string }[]>) {
    const rows = await rowsPromise;
    return new Map(rows.map((row) => [row.name, row.id]));
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());

