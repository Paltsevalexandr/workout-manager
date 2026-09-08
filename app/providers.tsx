"use client";

import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { Exercise, Workout } from "./_types";

type ExercisesContextType = {
  exercises: Exercise[];
  setExercises: Dispatch<SetStateAction<Exercise[]>>;
};

type WorkoutsContextType = {
    workouts: Workout[];
    setWorkouts: Dispatch<SetStateAction<Workout[]>>;
}

const ExercisesContext = createContext<ExercisesContextType | undefined>(undefined);
const WorkoutsContext = createContext<WorkoutsContextType | undefined>(undefined);

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

export function WorkoutsProvider({ children }: { children: React.ReactNode }) {
    const [workouts, setWorkouts] = useState<Workout[]>([
        {
            id: 0, name: 'Workout 1', exercises: [4, 5, 2, 1, 3, 0]
        },
        {
            id: 1, name: 'Workout 2', exercises: [2, 4, 5]
        },
        {
            id: 2, name: 'Workout 3', exercises: [0, 1, 3]
        }
    ]);

    return <WorkoutsContext.Provider value={{ workouts, setWorkouts }}>
        {children}
    </WorkoutsContext.Provider>
}

export function useExercisesContext() {
  const context = useContext(ExercisesContext);
  if (!context) {
    throw new Error('useExercisesContext must be used within ExercisesProvider');
  }
  return context;
}

export function useWorkoutsContext() {
    const context = useContext(WorkoutsContext);
    if (!context) {
        throw new Error('useWorkoutsContext must be used within WorkoutsProvider')
    }
    return context;
}

