"use client";

import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { PerformedSession } from "@/_types";

type PerformedSessionContextType = {
    performedSessions: PerformedSession[];
    setPerformedSessions: Dispatch<SetStateAction<PerformedSession[]>>;
}

const PerformedSessionsContext = createContext<PerformedSessionContextType | undefined>(undefined);

export function PerformedSessionsProvider({ children }: { children: React.ReactNode }) {
    const [performedSessions, setPerformedSessions] = useState<PerformedSession[]>([
        {
            date: 1788894136955 - (1000 * 60 * 60 * 24 * 14),
            id: 3,
            performedExercises: [
                { id: 7, workoutExerciseId: 6, sets: 1, target: 1, weight: 1, rest: 30 },
                { id: 8, workoutExerciseId: 7, sets: 1, target: 1, weight: 0, rest: 30 },
                { id: 9, workoutExerciseId: 8, sets: 1, target: 1, weight: 0, rest: 30 },
                { id: 10, workoutExerciseId: 9, sets: 1, target: 1, weight: 0, rest: 30 }

            ],
            workoutId: 2
        },
        {
            date: 1788894136955,
            id: 55,
            performedExercises: [
                { id: 7, workoutExerciseId: 6, sets: 1, target: 2, weight: 1, rest: 20 },
                { id: 8, workoutExerciseId: 7, sets: 1, target: 2, weight: 0, rest: 20 },
                { id: 9, workoutExerciseId: 8, sets: 1, target: 1, weight: 0, rest: 20 },
                { id: 10, workoutExerciseId: 9, sets: 1, target: 1, weight: 0, rest: 20 }

            ],
            workoutId: 2
        },
        {
            date: 1788894136955 - (1000 * 60 * 60 * 24 * 14),
            id: 20,
            performedExercises: [
                { id: 1, workoutExerciseId: 0, sets: 3, target: 20, weight: 19, rest: 60 },
                { id: 2, workoutExerciseId: 1, sets: 3, target: 30, weight: 0, rest: 60 },
                { id: 3, workoutExerciseId: 2, sets: 4, target: 12, weight: 44, rest: 60 },
                { id: 4, workoutExerciseId: 3, sets: 3, target: 11, weight: 0, rest: 60 },
                { id: 5, workoutExerciseId: 4, sets: 1, target: 15, weight: 0, rest: 60 },
                { id: 6, workoutExerciseId: 5, sets: 3, target: 17, weight: 0, rest: 60 },
            ],
            workoutId: 1
        },
        {
            date: 1788894136955 - (1000 * 60 * 60 * 24 * 21),
            id: 21,
            performedExercises: [
                { id: 1, workoutExerciseId: 0, sets: 3, target: 19, weight: 18, rest: 60 },
                { id: 2, workoutExerciseId: 1, sets: 3, target: 30, weight: 0, rest: 60 },
                { id: 3, workoutExerciseId: 2, sets: 4, target: 11, weight: 43, rest: 60 },
                { id: 4, workoutExerciseId: 3, sets: 3, target: 12, weight: 0, rest: 60 },
                { id: 5, workoutExerciseId: 4, sets: 1, target: 10, weight: 0, rest: 60 },
                { id: 6, workoutExerciseId: 5, sets: 3, target: 9, weight: 0, rest: 60 },
            ],
            workoutId: 1
        },
        {
            date: 1788894136955 - (1000 * 60 * 60 * 24 * 28),
            id: 22,
            performedExercises: [
                { id: 1, workoutExerciseId: 0, sets: 3, target: 18, weight: 17, rest: 60 },
                { id: 2, workoutExerciseId: 1, sets: 3, target: 30, weight: 0, rest: 60 },
                { id: 3, workoutExerciseId: 2, sets: 4, target: 10, weight: 42, rest: 60 },
                { id: 4, workoutExerciseId: 3, sets: 3, target: 13, weight: 0, rest: 60 },
                { id: 5, workoutExerciseId: 4, sets: 1, target: 15, weight: 0, rest: 60 },
                { id: 6, workoutExerciseId: 5, sets: 3, target: 13, weight: 0, rest: 60 },
            ],
            workoutId: 1
        },
        {
            date: 1788894136955 - (1000 * 60 * 60 * 24 * 35),
            id: 23,
            performedExercises: [
                { id: 1, workoutExerciseId: 0, sets: 3, target: 17, weight: 16, rest: 60 },
                { id: 2, workoutExerciseId: 1, sets: 3, target: 30, weight: 0, rest: 60 },
                { id: 3, workoutExerciseId: 2, sets: 4, target: 9, weight: 41, rest: 60 },
                { id: 4, workoutExerciseId: 3, sets: 3, target: 14, weight: 0, rest: 60 },
                { id: 5, workoutExerciseId: 4, sets: 1, target: 10, weight: 0, rest: 60 },
                { id: 6, workoutExerciseId: 5, sets: 3, target: 11, weight: 0, rest: 60 },
            ],
            workoutId: 1
        },
        {
            date: 1788894136955 - (1000 * 60 * 60 * 24 * 42),
            id: 24,
            performedExercises: [
                { id: 1, workoutExerciseId: 0, sets: 3, target: 16, weight: 15, rest: 60 },
                { id: 2, workoutExerciseId: 1, sets: 3, target: 30, weight: 0, rest: 60 },
                { id: 3, workoutExerciseId: 2, sets: 4, target: 8, weight: 40, rest: 60 },
                { id: 4, workoutExerciseId: 3, sets: 3, target: 15, weight: 0, rest: 60 },
                { id: 5, workoutExerciseId: 4, sets: 1, target: 15, weight: 0, rest: 60 },
                { id: 6, workoutExerciseId: 5, sets: 3, target: 15, weight: 0, rest: 60 },
            ],
            workoutId: 1
        },
        {
            date: 1788894136955 - (1000 * 60 * 60 * 24 * 49),
            id: 25,
            performedExercises: [
                { id: 1, workoutExerciseId: 0, sets: 3, target: 15, weight: 14, rest: 60 },
                { id: 2, workoutExerciseId: 1, sets: 3, target: 30, weight: 0, rest: 60 },
                { id: 3, workoutExerciseId: 2, sets: 4, target: 9, weight: 41, rest: 60 },
                { id: 4, workoutExerciseId: 3, sets: 3, target: 16, weight: 0, rest: 60 },
                { id: 5, workoutExerciseId: 4, sets: 1, target: 10, weight: 0, rest: 60 },
                { id: 6, workoutExerciseId: 5, sets: 3, target: 8, weight: 0, rest: 60 },
            ],
            workoutId: 1
        },
        {
            date: 1788894136955 - (1000 * 60 * 60 * 24 * 56),
            id: 26,
            performedExercises: [
                { id: 1, workoutExerciseId: 0, sets: 3, target: 14, weight: 13, rest: 60 },
                { id: 2, workoutExerciseId: 1, sets: 3, target: 30, weight: 0, rest: 60 },
                { id: 3, workoutExerciseId: 2, sets: 4, target: 11, weight: 43, rest: 60 },
                { id: 4, workoutExerciseId: 3, sets: 3, target: 17, weight: 0, rest: 60 },
                { id: 5, workoutExerciseId: 4, sets: 1, target: 15, weight: 0, rest: 60 },
                { id: 6, workoutExerciseId: 5, sets: 3, target: 16, weight: 0, rest: 60 },
            ],
            workoutId: 1
        },
        {
            date: 1788894136955 - (1000 * 60 * 60 * 24 * 63),
            id: 27,
            performedExercises: [
                { id: 1, workoutExerciseId: 0, sets: 3, target: 13, weight: 12, rest: 60 },
                { id: 2, workoutExerciseId: 1, sets: 3, target: 30, weight: 0, rest: 60 },
                { id: 3, workoutExerciseId: 2, sets: 3, target: 12, weight: 44, rest: 60 },
                { id: 4, workoutExerciseId: 3, sets: 3, target: 18, weight: 0, rest: 60 },
                { id: 5, workoutExerciseId: 4, sets: 1, target: 10, weight: 0, rest: 60 },
                { id: 6, workoutExerciseId: 5, sets: 3, target: 9, weight: 0, rest: 60 },
            ],
            workoutId: 1
        },
        {
            date: 1788894136955 - (1000 * 60 * 60 * 24 * 70),
            id: 28,
            performedExercises: [
                { id: 1, workoutExerciseId: 0, sets: 3, target: 12, weight: 11, rest: 60 },
                { id: 2, workoutExerciseId: 1, sets: 3, target: 30, weight: 0, rest: 60 },
                { id: 3, workoutExerciseId: 2, sets: 3, target: 10, weight: 42, rest: 60 },
                { id: 4, workoutExerciseId: 3, sets: 3, target: 19, weight: 0, rest: 60 },
                { id: 5, workoutExerciseId: 4, sets: 1, target: 15, weight: 0, rest: 60 },
                { id: 6, workoutExerciseId: 5, sets: 3, target: 14, weight: 0, rest: 60 },
            ],
            workoutId: 1
        },
        {
            date: 1788894136955 - (1000 * 60 * 60 * 24 * 77),
            id: 29,
            performedExercises: [
                { id: 1, workoutExerciseId: 0, sets: 3, target: 11, weight: 10, rest: 60 },
                { id: 2, workoutExerciseId: 1, sets: 3, target: 30, weight: 0, rest: 60 },
                { id: 3, workoutExerciseId: 2, sets: 3, target: 8, weight: 40, rest: 60 },
                { id: 4, workoutExerciseId: 3, sets: 3, target: 20, weight: 0, rest: 60 },
                { id: 5, workoutExerciseId: 4, sets: 1, target: 10, weight: 0, rest: 60 },
                { id: 6, workoutExerciseId: 5, sets: 3, target: 10, weight: 0, rest: 60 },
            ],
            workoutId: 1
        },
    ]);

    return (
        <PerformedSessionsContext.Provider value={{ performedSessions, setPerformedSessions }}>
            {children}
        </PerformedSessionsContext.Provider>
    );
}

export function usePerformedSessionsContext() {
    const context = useContext(PerformedSessionsContext);
    if (!context) {
        throw new Error('usePerformedSessionsContext must be used within PerformedSessionsProvider')
    }
    return context;
}
