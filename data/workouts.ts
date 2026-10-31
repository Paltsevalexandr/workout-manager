import "server-only";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { DataError, withNameConflictCheck } from "./errors";

const workoutExerciseSelect = {
    id: true,
    exerciseId: true,
    position: true,
} satisfies Prisma.WorkoutExerciseSelect;

const workoutSelect = {
    id: true,
    name: true,
    status: true,
    createdAt: true,
    archivedAt: true,
    workoutExercises: {
        select: workoutExerciseSelect,
        orderBy: [
            { position: "asc" },
            { id: "asc" }
        ],
        where: { deletedAt: null },
    },
} satisfies Prisma.WorkoutSelect;

const NAME_CONFLICT = {
    // Unique index over the generated activeName column, 
    // created by hand in a migration
    indexName: "Workout_activeName_key",
    errorMessage: "A workout with this name already exists",
};

export type WorkoutDTO = Prisma.WorkoutGetPayload<{ select: typeof workoutSelect }>;

export async function getWorkouts(): Promise<WorkoutDTO[]> {
    return prisma.workout.findMany({
        where: { deletedAt: null },
        select: workoutSelect,
        orderBy: { id: "asc" },
    });
}

export type WorkoutExerciseInput = {
    id: number | null;
    exerciseId: number;
};

export type WorkoutInput = {
    name: string;
    workoutExercises: WorkoutExerciseInput[];
};

export async function createWorkout(input: WorkoutInput): Promise<WorkoutDTO> {
    await assertWorkoutExercisesExist(
        input.workoutExercises.map(workoutExercise => workoutExercise.exerciseId)
    );

    const row = await withNameConflictCheck(() => prisma.workout.create({
        data: {
            name: input.name,
            workoutExercises: {
                create: input.workoutExercises.map((exercise, index) => (
                    {
                        exerciseId: exercise.exerciseId,
                        position: index
                    }
                ))
            }
        },
        select: workoutSelect
    }), NAME_CONFLICT);
    return row;
}

export async function updateWorkout(workoutId: number, input: WorkoutInput): Promise<WorkoutDTO> {
    const result = await withNameConflictCheck(() => prisma.$transaction(async (tx) => {
        const { count } = await tx.workout.updateMany({
            where: { id: workoutId, deletedAt: null },
            data: { name: input.name },
        });

        if (count === 0) {
            throw new DataError("Workout not found");
        }

        await assertWorkoutExercisesExist(
            input.workoutExercises
                .filter(workoutExercise => workoutExercise.id === null)
                .map(workoutExercise => workoutExercise.exerciseId),
            tx
        );

        const currentExercises = await tx.workoutExercise.findMany({
            where: { workoutId, deletedAt: null },
            select: { id: true, exerciseId: true }
        });

        for (const row of input.workoutExercises) {
            if (row.id !== null
                && !currentExercises.some(
                    exercise => exercise.id === row.id && exercise.exerciseId === row.exerciseId
                )) {
                throw new DataError("Workout exercise not found or changed");
            }
        }

        const keptIds = input.workoutExercises.flatMap(
            row => row.id === null ? [] : [row.id]
        );
        await tx.workoutExercise.updateMany({
            where: { workoutId, deletedAt: null, id: { notIn: keptIds } },
            data: { deletedAt: new Date() },
        });
        for (const [index, row] of input.workoutExercises.entries()) {
            if (row.id === null) {
                await tx.workoutExercise.create({
                    data: {
                        workoutId,
                        exerciseId: row.exerciseId,
                        position: index
                    }
                });
            }
            else {
                await tx.workoutExercise.update({
                    where: { id: row.id },
                    data: { position: index }
                });
            }
        }
        return tx.workout.findUniqueOrThrow({
            where: { id: workoutId, deletedAt: null },
            select: workoutSelect
        })
    }), NAME_CONFLICT);
    return result;
}

async function assertWorkoutExercisesExist(exerciseIds: number[], db: Prisma.TransactionClient = prisma) {
    const count = await db.exercise.count({
        where: { id: { in: exerciseIds }, deletedAt: null },
    });
    if (count !== new Set(exerciseIds).size) {
        throw new DataError("One or more selected exercises don't exist or were deleted");
    }
}
