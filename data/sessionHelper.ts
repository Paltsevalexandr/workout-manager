import { Prisma } from "@/generated/prisma/client";
import { DataError } from "./errors";
import { prisma } from "@/lib/prisma";

export type SessionExerciseInput = {
    workoutExerciseId: number;
    sets: number;
    target: number;
    weight: number;
    rest: number;
};

export function toValidDate(timestamp: number) {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
        throw new DataError("The date is invalid");
    }
    return date;
}

export function assertExerciseListIsValid(exercises: SessionExerciseInput[]) {
    if (exercises.length === 0) {
        throw new DataError("Session must have at least one exercise");
    }
    const sessionExercises = new Set(exercises.map(ex => ex.workoutExerciseId));
    if (sessionExercises.size !== exercises.length) {
        throw new DataError("The same exercise is added to the session more than once");
    }
}

export function assertExercisesAllowed(allowedIds: Set<number>, exercises: SessionExerciseInput[]) {
    if (!exercises.every(
        ex => allowedIds.has(ex.workoutExerciseId)
    )) {
        throw new DataError("One or more exercises don't belong to this workout");
    }
}

export function toExerciseCreateData(exercise: SessionExerciseInput) {
    return {
        workoutExerciseId: exercise.workoutExerciseId,
        sets: exercise.sets,
        target: exercise.target,
        weight: exercise.weight,
        rest: exercise.rest,
    }
}

export async function findActiveWorkoutOrThrow(
    workoutId: number,
    transaction: Prisma.TransactionClient = prisma
) {
    const workout = await transaction.workout.findUnique({
        where: { id: workoutId, deletedAt: null },
        select: {
            workoutExercises: {
                where: { deletedAt: null },
                select: { id: true }
            },
            id: true,
        }
    });

    if (!workout) {
        throw new DataError("Workout not found");
    }
    return workout;
}
