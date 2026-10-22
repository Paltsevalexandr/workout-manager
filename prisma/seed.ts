import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient, ExerciseTargetType } from "../generated/prisma/client";

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

// One row per workout exercise, in the same order as SeedWorkout.exercises
type SessionRow = [sets: number, target: number, weight: number, rest: number];

type SeedSession = {
    daysAgo: number; // negative = in the future
    exercises: SessionRow[];
};

type SeedWorkout = {
    name: string;
    archived?: boolean;
    exercises: string[]; // exercise names in display order
    performed?: SeedSession[];
    planned?: SeedSession[];
};

const workouts: SeedWorkout[] = [
    {
        name: "Workout 1",
        exercises: ["Dumbbell row", "Plank", "Barbell squat", "Push-ups", "Running", "Lunges"],
        performed: [
            { daysAgo: 14, exercises: [[3, 20, 19, 60], [3, 30, 0, 60], [4, 12, 44, 60], [3, 11, 0, 60], [1, 15, 0, 60], [3, 17, 0, 60]] },
            { daysAgo: 21, exercises: [[3, 19, 18, 60], [3, 30, 0, 60], [4, 11, 43, 60], [3, 12, 0, 60], [1, 10, 0, 60], [3, 9, 0, 60]] },
            { daysAgo: 28, exercises: [[3, 18, 17, 60], [3, 30, 0, 60], [4, 10, 42, 60], [3, 13, 0, 60], [1, 15, 0, 60], [3, 13, 0, 60]] },
            { daysAgo: 35, exercises: [[3, 17, 16, 60], [3, 30, 0, 60], [4, 9, 41, 60], [3, 14, 0, 60], [1, 10, 0, 60], [3, 11, 0, 60]] },
        ],
        planned: [
            { daysAgo: -2, exercises: [[3, 25, 20, 60], [3, 30, 0, 60], [4, 12, 44, 60], [3, 11, 0, 60], [1, 15, 0, 60], [3, 17, 0, 60]] },
        ],
    },
    {
        // Plank twice: the same exercise can appear in a workout more than once
        name: "Workout 2",
        exercises: ["Barbell squat", "Dumbbell row", "Plank", "Plank"],
        performed: [
            { daysAgo: 3, exercises: [[1, 2, 1, 20], [1, 2, 0, 20], [1, 1, 0, 20], [1, 1, 0, 20]] },
            { daysAgo: 17, exercises: [[1, 1, 1, 30], [1, 1, 0, 30], [1, 1, 0, 30], [1, 1, 0, 30]] },
        ],
    },
    {
        name: "Workout 3",
        exercises: ["Barbell squat"],
    },
    {
        name: "Old routine",
        archived: true,
        exercises: ["Push-ups", "Lunges"],
    },
];

function daysAgo(days: number) {
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

// Turns compact tuples into PerformedExercise/PlannedExercise rows
function toExerciseRows(rows: SessionRow[], workoutExerciseIds: number[]) {
    if (rows.length !== workoutExerciseIds.length) {
        throw new Error(`Expected ${workoutExerciseIds.length} rows, got ${rows.length}`);
    }
    return rows.map(([sets, target, weight, rest], index) => ({
        workoutExerciseId: workoutExerciseIds[index],
        sets, target, weight, rest,
    }));
}

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

    // 4. Workouts with their exercises, history and plans
    const exerciseIds = await getIdsByName(prisma.exercise.findMany());

    for (const workout of workouts) {
        const created = await prisma.workout.create({
            data: {
                name: workout.name,
                status: workout.archived ? "archived" : "active",
                archivedAt: workout.archived ? daysAgo(30) : null,
                workoutExercises: {
                    create: workout.exercises.map((name, index) => ({
                        exerciseId: exerciseIds.get(name)!,
                        position: index,
                    })),
                },
            },
            include: {
                workoutExercises: { orderBy: { position: "asc" } },
            },
        });

        const workoutExerciseIds = created.workoutExercises.map((we) => we.id);

        for (const session of workout.performed ?? []) {
            await prisma.performedSession.create({
                data: {
                    workoutId: created.id,
                    date: daysAgo(session.daysAgo),
                    performedExercises: {
                        create: toExerciseRows(session.exercises, workoutExerciseIds),
                    },
                },
            });
        }

        for (const session of workout.planned ?? []) {
            await prisma.plannedSession.create({
                data: {
                    workoutId: created.id,
                    date: daysAgo(session.daysAgo),
                    plannedExercises: {
                        create: toExerciseRows(session.exercises, workoutExerciseIds),
                    },
                },
            });
        }
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

