"use client";

import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { PlannedSession } from "@/_types";

type PlannedSessionContextType = {
    plannedSessions: PlannedSession[];
    setPlannedSessions: Dispatch<SetStateAction<PlannedSession[]>>;
}

const PlannedSessionsContext = createContext<PlannedSessionContextType | undefined>(undefined);

export function PlannedSessionsProvider({ children }: { children: React.ReactNode }) {
    const [plannedSessions, setPlannedSessions] = useState<PlannedSession[]>([
        {
            id: 1,
            workoutId: 1,
            date: Date.now(),
            plannedExercises: [
                { id: 1, workoutExerciseId: 0, sets: 3, target: 25, weight: 20, rest: 60 },
                { id: 2, workoutExerciseId: 1, sets: 3, target: 30, weight: 0, rest: 60 },
                { id: 3, workoutExerciseId: 2, sets: 4, target: 12, weight: 44, rest: 60 },
                { id: 4, workoutExerciseId: 3, sets: 3, target: 11, weight: 0, rest: 60 },
                { id: 5, workoutExerciseId: 4, sets: 1, target: 15, weight: 0, rest: 60 },
                { id: 6, workoutExerciseId: 5, sets: 3, target: 17, weight: 0, rest: 60 },
            ]
        }
    ]);

    return (
        <PlannedSessionsContext.Provider value={{ plannedSessions, setPlannedSessions }}>
            {children}
        </PlannedSessionsContext.Provider>
    );
}

export function usePlannedSessionsContext() {
    const context = useContext(PlannedSessionsContext);
    if (!context) {
        throw new Error('usePlannedSessionsContext must be used within PlannedSessionsProvider');
    }
    return context;
}
