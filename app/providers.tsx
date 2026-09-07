"use client";

import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { Exercise } from "./_types";

type ExercisesContextType = {
  exercises: Exercise[];
  setExercises: Dispatch<SetStateAction<Exercise[]>>;
};

const ExercisesContext = createContext<ExercisesContextType | undefined>(undefined);

export function ExercisesProvider({ children }: { children: React.ReactNode }) {
  const [exercises, setExercises] = useState<Exercise[]>([
        {
            id: 0,
            name: "Push-ups",
            category: "strength",
            muscleGroup: "chest",
            target: "reps",
        },
        {
            id: 1,
            name: "Barbell squat",
            category: "strength",
            muscleGroup: "legs",
            target: "reps",
        },
        {
            id: 2,
            name: "Running",
            category: "cardio",
            muscleGroup: "legs",
            target: "duration",
        },
        {
            id: 3,
            name: "Dumbbell row",
            category: "strength",
            muscleGroup: "back",
            target: "reps",
        },
        {
            id: 4,
            name: "Plank",
            category: "mobility",
            muscleGroup: "core",
            target: "duration",
        },
        {
            id: 5,
            name: "Lunges",
            category: "stretching",
            muscleGroup: "legs",
            target: "reps",
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
    throw new Error('useExercisesContext must be used within MyProvider');
  }
  return context;
}

