import "server-only";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { DataError } from "./errors";
import { assertExerciseListIsValid, assertExercisesAllowed, findActiveWorkoutOrThrow, SessionExerciseInput, toExerciseCreateData, toValidDate } from "./sessionHelper";

const plannedExerciseSelect = {
    id: true,
    sets: true,
    target: true,
    weight: true,
    rest: true,
    workoutExerciseId: true,
} satisfies Prisma.PlannedExerciseSelect;

const plannedSessionSelect = {
    id: true,
    workoutId: true,
    date: true,
    plannedExercises: {
        select: plannedExerciseSelect,
        orderBy: [
            { workoutExercise: { position: "asc" } },
            { id: "asc" }
        ],
    }
} satisfies Prisma.PlannedSessionSelect;

export type PlannedSessionDTO = Prisma.PlannedSessionGetPayload<{ select: typeof plannedSessionSelect }>;
export type PlannedExerciseDTO = Prisma.PlannedExerciseGetPayload<{ select: typeof plannedExerciseSelect }>;

export async function getPlannedSessions(
    {
        workoutId,
        includeDeleted
    }: {
        workoutId: number | null,
        includeDeleted: boolean
    }
): Promise<PlannedSessionDTO[]> {
    return await prisma.plannedSession.findMany({
        where: {
            workoutId: workoutId ?? undefined,
            workout: includeDeleted ? undefined : { deletedAt: null },
        },
        select: plannedSessionSelect,
        orderBy: [{ date: "asc" }, { id: "asc" }]
    });
}

export type PlannedExerciseInput = SessionExerciseInput;

export type PlannedSessionInput = {
    workoutId: number;
    date: number;
    plannedExercises: PlannedExerciseInput[];
};

export async function createPlannedSession(input: PlannedSessionInput): Promise<PlannedSessionDTO> {
    const date = toValidDate(input.date);
    assertExerciseListIsValid(input.plannedExercises);
    const workout = await findActiveWorkoutOrThrow(input.workoutId);
    const allowedIds = new Set(workout.workoutExercises.map(row => row.id));
    assertExercisesAllowed(allowedIds, input.plannedExercises);

    return await prisma.plannedSession.create({
        data: {
            workoutId: input.workoutId,
            date,
            plannedExercises: {
                create: input.plannedExercises.map(toExerciseCreateData)
            }
        },
        select: plannedSessionSelect
    });
}

export async function updatePlannedSession(sessionId: number, input: PlannedSessionInput): Promise<PlannedSessionDTO> {
    const date = toValidDate(input.date);
    assertExerciseListIsValid(input.plannedExercises);
    return await prisma.$transaction(async (tx) => {
        const { count } = await tx.plannedSession.updateMany({
            where: {
                id: sessionId,
                workoutId: input.workoutId
            },
            data: { date }
        });
        if (!count) {
            throw new DataError("Planned session not found");
        }
        const session = await tx.plannedSession.findUniqueOrThrow({
            where: { id: sessionId },
            select: plannedSessionSelect
        });
        const workout = await findActiveWorkoutOrThrow(session.workoutId, tx);
        const allowedIds = new Set(workout.workoutExercises.map(row => row.id));
        session.plannedExercises.forEach(
            ex => allowedIds.add(ex.workoutExerciseId)
        );

        assertExercisesAllowed(allowedIds, input.plannedExercises);

        // delete old list of exercises
        await tx.plannedExercise.deleteMany({ where: { sessionId } });

        // create new list of exercises
        return await tx.plannedSession.update({
            where: { id: sessionId },
            data: {
                plannedExercises: {
                    create: input.plannedExercises.map(toExerciseCreateData),
                },
            },
            select: plannedSessionSelect,
        });
    });
}

export async function deletePlannedSession(sessionId: number): Promise<void> {
    const { count } = await prisma.plannedSession.deleteMany({
        where: { id: sessionId }
    });
    if (!count) {
        throw new DataError("Planned session not found");
    }
}
