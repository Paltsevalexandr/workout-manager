import "server-only";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { DataError } from "./errors";
import { assertExerciseListIsValid, assertExercisesAllowed, findActiveWorkoutOrThrow, SessionExerciseInput, toExerciseCreateData, toValidDate } from "./sessionHelper";

const performedExerciseSelect = {
    id: true,
    sets: true,
    target: true,
    weight: true,
    rest: true,
    workoutExerciseId: true,
} satisfies Prisma.PerformedExerciseSelect;

const performedSessionSelect = {
    id: true,
    workoutId: true,
    date: true,
    performedExercises: {
        select: performedExerciseSelect,
        orderBy: [
            { workoutExercise: { position: "asc" } },
            { id: "asc" }
        ],
    }
} satisfies Prisma.PerformedSessionSelect;

export type PerformedSessionDTO = Prisma.PerformedSessionGetPayload<{ select: typeof performedSessionSelect }>;
export type PerformedExerciseDTO = Prisma.PerformedExerciseGetPayload<{ select: typeof performedExerciseSelect }>;

export async function getPerformedSessions(
    {
        workoutId,
        includeDeleted
    }: {
        workoutId: number | null,
        includeDeleted: boolean
    }
): Promise<PerformedSessionDTO[]> {
    return await prisma.performedSession.findMany({
        where: {
            workoutId: workoutId ?? undefined,
            workout: includeDeleted ? undefined : { deletedAt: null },
        },
        select: performedSessionSelect,
        orderBy: [{ date: "desc" }, { id: "desc" }]
    });
}

export type PerformedExerciseInput = SessionExerciseInput;

export type PerformedSessionInput = {
    workoutId: number;
    date: number;
    performedExercises: PerformedExerciseInput[];
};

export async function createPerformedSession(input: PerformedSessionInput): Promise<PerformedSessionDTO> {
    const date = toValidDate(input.date);
    assertExerciseListIsValid(input.performedExercises);
    const workout = await findActiveWorkoutOrThrow(input.workoutId);
    const allowedIds = new Set(workout.workoutExercises.map(row => row.id));
    assertExercisesAllowed(allowedIds, input.performedExercises);

    return await prisma.performedSession.create({
        data: {
            workoutId: input.workoutId,
            date,
            performedExercises: {
                create: input.performedExercises.map(toExerciseCreateData)
            }
        },
        select: performedSessionSelect
    });
}

export async function updatePerformedSession(sessionId: number, input: PerformedSessionInput): Promise<PerformedSessionDTO> {
    const date = toValidDate(input.date);
    assertExerciseListIsValid(input.performedExercises);
    return await prisma.$transaction(async (tx) => {
        const { count } = await tx.performedSession.updateMany({
            where: {
                id: sessionId,
                workoutId: input.workoutId
            },
            data: { date }
        });
        if (!count) {
            throw new DataError("Performed session not found");
        }
        const session = await tx.performedSession.findUniqueOrThrow({
            where: { id: sessionId },
            select: performedSessionSelect
        });
        const workout = await findActiveWorkoutOrThrow(session.workoutId, tx);
        const allowedIds = new Set(workout.workoutExercises.map(row => row.id));
        session.performedExercises.forEach(
            ex => allowedIds.add(ex.workoutExerciseId)
        );

        assertExercisesAllowed(allowedIds, input.performedExercises);

        // delete old list of exercises
        await tx.performedExercise.deleteMany({ where: { sessionId } });

        // create new list of exercises
        return await tx.performedSession.update({
            where: { id: sessionId },
            data: {
                performedExercises: {
                    create: input.performedExercises.map(toExerciseCreateData),
                },
            },
            select: performedSessionSelect,
        });
    });
}

export async function deletePerformedSession(sessionId: number): Promise<void> {
    const { count } = await prisma.performedSession.deleteMany({
        where: { id: sessionId }
    });
    if (!count) {
        throw new DataError("Performed session not found");
    }
}
