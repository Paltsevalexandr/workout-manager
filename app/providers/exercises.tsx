"use client";

import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { Exercise } from "@/_types";

type ExercisesContextType = {
    exercises: Exercise[];
    setExercises: Dispatch<SetStateAction<Exercise[]>>;
};

const ExercisesContext = createContext<ExercisesContextType | undefined>(undefined);

export function ExercisesProvider({ children }: { children: React.ReactNode }) {
    const [exercises, setExercises] = useState<Exercise[]>([
        {
            id: 1,
            name: "Push-ups",
            parent: null,
            categories: [{ id: 1, name: "strength", parentId: null, isSystem: true }],
            muscleGroups: [
                {
                    id: 1,
                    name: "Chest",
                    parentId: null,
                    isSystem: true,

                },
            ],
            target: "reps",
            isSystem: true,
            isDeleted: false,
        },
        {
            id: 2,
            name: "Barbell squat",
            parent: null,
            categories: [{ id: 1, name: "strength", parentId: null, isSystem: true }],
            muscleGroups: [
                {
                    id: 6,
                    name: "Legs",
                    parentId: null,
                    isSystem: true,

                },
            ],
            target: "reps",
            isSystem: true,
            isDeleted: false,
        },
        {
            id: 3,
            name: "Running",
            parent: null,
            categories: [{ id: 2, name: "cardio", parentId: null, isSystem: true }],
            muscleGroups: [
                {
                    id: 6,
                    name: "Legs",
                    parentId: null,
                    isSystem: true,

                },
            ],
            target: "duration",
            isSystem: true,
            isDeleted: false,
        },
        {
            id: 4,
            name: "Dumbbell row",
            parent: null,
            categories: [{ id: 1, name: "strength", parentId: null, isSystem: true }],
            muscleGroups: [
                {
                    id: 2,
                    name: "Back",
                    parentId: null,
                    isSystem: true,

                },
            ],
            target: "reps",
            isSystem: true,
            isDeleted: false,
        },
        {
            id: 5,
            name: "Plank",
            parent: null,
            categories: [{ id: 3, name: "mobility", parentId: null, isSystem: true }],
            muscleGroups: [
                {
                    id: 5,
                    name: "Core",
                    parentId: null,
                    isSystem: true,

                },
            ],
            target: "duration",
            isSystem: true,
            isDeleted: false,
        },
        {
            id: 6,
            name: "Lunges",
            parent: null,
            categories: [{ id: 4, name: "stretching", parentId: null, isSystem: true }],
            muscleGroups: [
                {
                    id: 6,
                    name: "Legs",
                    parentId: null,
                    isSystem: true,

                },
            ],
            target: "reps",
            isSystem: true,
            isDeleted: false,
        },
    ]);

    return (
        <ExercisesContext.Provider value={{ exercises, setExercises }}>
            {children}
        </ExercisesContext.Provider>
    );
}

export function useExercisesContext() {
    const context = useContext(ExercisesContext);
    if (!context) {
        throw new Error('useExercisesContext must be used within ExercisesProvider');
    }
    return context;
}
