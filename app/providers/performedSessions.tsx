"use client";

import { createContext, useContext } from "react";
import { PerformedSession } from "@/_types";

type PerformedSessionContextType = {
    performedSessions: PerformedSession[];
}

const PerformedSessionsContext = createContext<PerformedSessionContextType | undefined>(undefined);

export function PerformedSessionsProvider({
    children, performedSessions
}: { children: React.ReactNode, performedSessions: PerformedSession[] }) {
    return (
        <PerformedSessionsContext.Provider value={{ performedSessions }}>
            {children}
        </PerformedSessionsContext.Provider>
    );
}

export function usePerformedSessionsContext() {
    const context = useContext(PerformedSessionsContext);
    if (!context) {
        throw new Error("usePerformedSessionsContext must be used within PerformedSessionsProvider")
    }
    return context;
}
