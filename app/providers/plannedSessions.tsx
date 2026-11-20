"use client";

import { createContext, useContext } from "react";
import { PlannedSession } from "@/_types";

type PlannedSessionContextType = {
    plannedSessions: PlannedSession[];
}

const PlannedSessionsContext = createContext<PlannedSessionContextType | undefined>(undefined);

export function PlannedSessionsProvider({
    children,
    plannedSessions
}: { children: React.ReactNode, plannedSessions: PlannedSession[] }) {
    return (
        <PlannedSessionsContext.Provider value={{ plannedSessions }}>
            {children}
        </PlannedSessionsContext.Provider>
    );
}

export function usePlannedSessionsContext() {
    const context = useContext(PlannedSessionsContext);
    if (!context) {
        throw new Error("usePlannedSessionsContext must be used within PlannedSessionsProvider");
    }
    return context;
}
