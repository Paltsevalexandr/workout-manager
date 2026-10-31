import { Prisma } from "@/generated/prisma/client";

// An expected error to be shown to the user
export class DataError extends Error { }

// Runs a mutation and turns a violation of the unique index over activeName
// (a duplicate name among active rows) into a user-facing DataError.
// The index is what stops concurrent requests with the same name, so the
// conflict can only be detected when the write fails. Other errors pass through.
export async function withNameConflictCheck<T>(
    mutation: () => Promise<T>,
    { indexName, errorMessage }: { indexName: string, errorMessage: string }
): Promise<T> {
    try {
        return await mutation();
    } catch (error) {
        const isNameConflict =
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002" &&
            // The index name sits in the driver adapter's error details
            JSON.stringify(error.meta ?? {}).includes(indexName);
        if (isNameConflict) {
            throw new DataError(errorMessage);
        }
        throw error;
    }
}
