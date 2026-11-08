"use client";

import { createContext, useContext } from "react";
import { Exercise } from "@/_types";

type ExercisesContextType = {
    exercises: Exercise[];
};

type Props = {
    children: React.ReactNode;
    exercises: Exercise[]
};

const ExercisesContext = createContext<ExercisesContextType | undefined>(undefined);

export function ExercisesProvider({ children, exercises }: Props) {
    return (
        <ExercisesContext.Provider value={{ exercises }}>
            {children}
        </ExercisesContext.Provider>
    );
}

export function useExercisesContext() {
    const context = useContext(ExercisesContext);
    if (!context) {
        throw new Error("useExercisesContext must be used within ExercisesProvider");
    }
    return context;
}
