"use client";

import { createContext, useContext } from "react";
import { MuscleGroup } from "@/_types";

type MuscleGroupContextType = {
    muscleGroups: MuscleGroup[];
}
type Props = {
    children: React.ReactNode;
    muscleGroups: MuscleGroup[];
};

const MuscleGroupsContext = createContext<MuscleGroupContextType | undefined>(undefined);

export function MuscleGroupsProvider({ children, muscleGroups }: Props) {
    return (
        <MuscleGroupsContext.Provider value={{ muscleGroups }}>
            {children}
        </MuscleGroupsContext.Provider>
    )
}

export function useMuscleGroupsContext() {
    const context = useContext(MuscleGroupsContext);
    if (!context) {
        throw new Error("useMuscleGroupsContext must be used within MuscleGroupsProvider")
    }
    return context;
}
