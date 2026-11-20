"use client";

import type { ActionResult } from "@/lib/mutation";
import { useTransition, useState } from "react";

type SubmitAction = {
    action: () => Promise<ActionResult<unknown>>,
    onSuccess?: () => void
};

export function useServerAction() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string>("");

    function runServerAction({ action, onSuccess }: SubmitAction) {
        resetError();
        startTransition(async () => {
            const result = await action();
            if (!result.ok) {
                setError(result.error);
                return;
            }
            if (onSuccess) {
                resetError();
                onSuccess();
            }
        });
    }

    function resetError(): void {
        setError("");
    }

    return { runServerAction, resetError, isPending, error, };
}
