"use client";

import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { Exercise, MuscleGroup, Workout } from "../_types";

type ExercisesContextType = {
    exercises: Exercise[];
    setExercises: Dispatch<SetStateAction<Exercise[]>>;
};

type WorkoutsContextType = {
    workouts: Workout[];
    setWorkouts: Dispatch<SetStateAction<Workout[]>>;
}

type MuscleGroupContextType = {
    muscleGroups: MuscleGroup[];
    setMuscleGroups: Dispatch<SetStateAction<MuscleGroup[]>>;
}

const ExercisesContext = createContext<ExercisesContextType | undefined>(undefined);
const WorkoutsContext = createContext<WorkoutsContextType | undefined>(undefined);
const MuscleGroupsContext = createContext<MuscleGroupContextType | undefined>(undefined);

export function ExercisesProvider({ children }: { children: React.ReactNode }) {
    // const parentMuscleGroups = [
    //     {
    //         id: 1,
    //         name: "Chest",
    //     },
    //     {
    //         id: 2,
    //         name: "Back",
    //     },
    //     {
    //         id: 3,
    //         name: "Shoulders",
    //     },
    //     {
    //         id: 4,
    //         name: "Arms",
    //     },
    //     {
    //         id: 5,
    //         name: "Core",
    //     },
    //     {
    //         id: 6,
    //         name: "Legs",
    //     },
    // ];
    
    const [exercises, setExercises] = useState<Exercise[]>([
        {
            id: 1,
            name: "Push-ups",
            category: "strength",
            muscleGroups: [
                {
                    id: 1,
                    name: "Chest",
                    parentId: null,
                    isSystem: true,
                },
            ],
            target: "reps",
        },
        {
            id: 2,
            name: "Barbell squat",
            category: "strength",
            muscleGroups: [
                {
                    id: 6,
                    name: "Legs",
                    parentId: null,
                    isSystem: true,
                },
            ],
            target: "reps",
        },
        {
            id: 3,
            name: "Running",
            category: "cardio",
            muscleGroups: [
                {
                    id: 6,
                    name: "Legs",
                    parentId: null,
                    isSystem: true,
                },
            ],
            target: "duration",
        },
        {
            id: 4,
            name: "Dumbbell row",
            category: "strength",
            muscleGroups: [
                {
                    id: 2,
                    name: "Back",
                    parentId: null,
                    isSystem: true,
                },
            ],
            target: "reps",
        },
        {
            id: 5,
            name: "Plank",
            category: "mobility",
            muscleGroups: [
                {
                    id: 5,
                    name: "Core",
                    parentId: null,
                    isSystem: true,
                },
            ],
            target: "duration",
        },
        {
            id: 6,
            name: "Lunges",
            category: "stretching",
            muscleGroups: [
                {
                    id: 6,
                    name: "Legs",
                    parentId: null,
                    isSystem: true,
                },
            ],
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
            id: 1, name: 'Workout 1', workoutExercises: [
                {
                    id: 0,
                    workoutTemplateId: 1,
                    exerciseId: 4
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
            id: 2, name: 'Workout 2', workoutExercises: [
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
            id: 3, name: 'Workout 3', workoutExercises: [{
                id: 10,
                workoutTemplateId: 3,
                exerciseId: 2
            },]
        },
        {
            id: 4, name: 'Workout 4', workoutExercises: [{
                id: 11,
                workoutTemplateId: 4,
                exerciseId: 2
            },]
        },
        {
            id: 5, name: 'Workout 5', workoutExercises: [
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

export function useMuscleGroupsContext() {
    const context = useContext(MuscleGroupsContext);
    if (!context) {
        throw new Error('useMuscleGroupsContext must be used within MuscleGroupsProvider')
    }
    return context;
}

