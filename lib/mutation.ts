import "server-only";

import { revalidatePath } from "next/cache";
import { DataError } from "@/data/errors";
import { z } from "zod";

export const idSchema = z.number().int().positive();
export type ActionResult<T = undefined> =
    | { ok: true; data: T }
    | { ok: false; error: string };

// Runs a DAL mutation: expected errors go back to the UI, unexpected ones are rethrown
export async function runMutation<T>(mutation: () => Promise<T>): Promise<ActionResult<T>> {
    let data: T;
    try {
        data = await mutation();
    } catch (error) {
        if (error instanceof DataError) {
            return { ok: false, error: error.message };
        }
        throw error;
    }
    revalidatePath("/", "layout");
    return { ok: true, data };
}
