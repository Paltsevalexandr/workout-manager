"use client";

import { createContext, useContext } from "react";
import { Workout } from "@/_types";

type WorkoutsContextType = {
    workouts: Workout[]
}

const WorkoutsContext = createContext<WorkoutsContextType | undefined>(undefined);

export function WorkoutsProvider({
    children, workouts
}: { children: React.ReactNode, workouts: Workout[] }) {
    return (
        <WorkoutsContext.Provider value={{ workouts }}>
            {children}
        </WorkoutsContext.Provider>
    )
}

export function useWorkoutsContext() {
    const context = useContext(WorkoutsContext);
    if (!context) {
        throw new Error("useWorkoutsContext must be used within WorkoutsProvider")
    }
    return context;
}
