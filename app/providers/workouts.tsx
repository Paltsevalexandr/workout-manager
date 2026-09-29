"use client";

import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { Workout } from "@/_types";

type WorkoutsContextType = {
    workouts: Workout[];
    setWorkouts: Dispatch<SetStateAction<Workout[]>>;
}

const WorkoutsContext = createContext<WorkoutsContextType | undefined>(undefined);

export function WorkoutsProvider({ children }: { children: React.ReactNode }) {
    const [workouts, setWorkouts] = useState<Workout[]>([
        {
            id: 1, name: 'Workout 1', status: "active", workoutExercises: [
                {
                    id: 0,
                    workoutTemplateId: 1,
                    exerciseId: 4,
                },
                {
                    id: 1,
                    workoutTemplateId: 1,
                    exerciseId: 5
                },
                {
                    id: 2,
                    workoutTemplateId: 1,
                    exerciseId: 2
                },
                {
                    id: 3,
                    workoutTemplateId: 1,
                    exerciseId: 1
                },
                {
                    id: 4,
                    workoutTemplateId: 1,
                    exerciseId: 3
                },
                {
                    id: 5,
                    workoutTemplateId: 1,
                    exerciseId: 6
                }
            ]
        },
        {
            id: 2, name: 'Workout 2', status: "active", workoutExercises: [
                {
                    id: 6,
                    workoutTemplateId: 2,
                    exerciseId: 2
                },
                {
                    id: 7,
                    workoutTemplateId: 2,
                    exerciseId: 4
                },
                {
                    id: 8,
                    workoutTemplateId: 2,
                    exerciseId: 5
                },
                {
                    id: 9,
                    workoutTemplateId: 2,
                    exerciseId: 5
                }
            ]
        },
        {
            id: 3, name: 'Workout 3', status: "active", workoutExercises: [{
                id: 10,
                workoutTemplateId: 3,
                exerciseId: 2
            },]
        },
        {
            id: 4, name: 'Workout 4', status: "active", workoutExercises: [{
                id: 11,
                workoutTemplateId: 4,
                exerciseId: 2
            },]
        },
        {
            id: 5, name: 'Workout 5', status: "active", workoutExercises: [
                {
                    id: 12,
                    workoutTemplateId: 5,
                    exerciseId: 2
                },
            ]
        }
    ]);

    return (
        <WorkoutsContext.Provider value={{ workouts, setWorkouts }}>
            {children}
        </WorkoutsContext.Provider>
    )
}

export function useWorkoutsContext() {
    const context = useContext(WorkoutsContext);
    if (!context) {
        throw new Error('useWorkoutsContext must be used within WorkoutsProvider')
    }
    return context;
}
