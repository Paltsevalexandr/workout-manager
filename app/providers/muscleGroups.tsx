"use client";

import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { MuscleGroup } from "@/_types";

type MuscleGroupContextType = {
    muscleGroups: MuscleGroup[];
    setMuscleGroups: Dispatch<SetStateAction<MuscleGroup[]>>;
}

const MuscleGroupsContext = createContext<MuscleGroupContextType | undefined>(undefined);

export function MuscleGroupsProvider({ children }: { children: React.ReactNode }) {
    const muscleGroupsInitial: MuscleGroup[] = [
        // Parent groups
        {
            id: 1,
            name: "Chest",
            parentId: null,
            isSystem: true,

        },
        {
            id: 2,
            name: "Back",
            parentId: null,
            isSystem: true,

        },
        {
            id: 3,
            name: "Shoulders",
            parentId: null,
            isSystem: true,

        },
        {
            id: 4,
            name: "Arms",
            parentId: null,
            isSystem: true,

        },
        {
            id: 5,
            name: "Core",
            parentId: null,
            isSystem: true,

        },
        {
            id: 6,
            name: "Legs",
            parentId: null,
            isSystem: true,

        },

        // Chest
        {
            id: 7,
            name: "Upper Chest",
            parentId: 1,
            isSystem: true,
        },
        {
            id: 8,
            name: "Lower Chest",
            parentId: 1,
            isSystem: true,
        },

        // Back
        {
            id: 9,
            name: "Lats",
            parentId: 2,
            isSystem: true,
        },
        {
            id: 10,
            name: "Upper Back",
            parentId: 2,
            isSystem: true,
        },
        {
            id: 11,
            name: "Traps",
            parentId: 2,
            isSystem: true,
        },
        {
            id: 12,
            name: "Lower Back",
            parentId: 2,
            isSystem: true,
        },

        // Shoulders
        {
            id: 13,
            name: "Front Delts",
            parentId: 3,
            isSystem: true,
        },
        {
            id: 14,
            name: "Side Delts",
            parentId: 3,
            isSystem: true,
        },
        {
            id: 15,
            name: "Rear Delts",
            parentId: 3,
            isSystem: true,
        },

        // Arms
        {
            id: 16,
            name: "Biceps",
            parentId: 4,
            isSystem: true,
        },
        {
            id: 17,
            name: "Triceps",
            parentId: 4,
            isSystem: true,
        },
        {
            id: 18,
            name: "Forearms",
            parentId: 4,
            isSystem: true,
        },

        // Core
        {
            id: 19,
            name: "Abs",
            parentId: 5,
            isSystem: true,
        },
        {
            id: 20,
            name: "Obliques",
            parentId: 5,
            isSystem: true,
        },

        // Legs
        {
            id: 21,
            name: "Quadriceps",
            parentId: 6,
            isSystem: true,
        },
        {
            id: 22,
            name: "Hamstrings",
            parentId: 6,
            isSystem: true,

        },
        {
            id: 23,
            name: "Glutes",
            parentId: 6,
            isSystem: true,
        },
        {
            id: 24,
            name: "Calves",
            parentId: 6,
            isSystem: true,
        },
        {
            id: 25,
            name: "Adductors",
            parentId: 6,
            isSystem: true,
        },
    ];
    const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>(muscleGroupsInitial);

    return (
        <MuscleGroupsContext.Provider value={{ muscleGroups, setMuscleGroups }}>
            {children}
        </MuscleGroupsContext.Provider>
    )
}

export function useMuscleGroupsContext() {
    const context = useContext(MuscleGroupsContext);
    if (!context) {
        throw new Error('useMuscleGroupsContext must be used within MuscleGroupsProvider')
    }
    return context;
}
