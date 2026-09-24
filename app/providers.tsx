"use client";

import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { Exercise, MuscleGroup, Workout, PlannedSession, PerformedSession } from "../_types";

type ExercisesContextType = {
    exercises: Exercise[];
    setExercises: Dispatch<SetStateAction<Exercise[]>>;
};
type PlannedSessionContextType = {
    plannedSessions: PlannedSession[];
    setPlannedSessions: Dispatch<SetStateAction<PlannedSession[]>>;
}

type WorkoutsContextType = {
    workouts: Workout[];
    setWorkouts: Dispatch<SetStateAction<Workout[]>>;
}

type MuscleGroupContextType = {
    muscleGroups: MuscleGroup[];
    setMuscleGroups: Dispatch<SetStateAction<MuscleGroup[]>>;
}
type PerformedSessionContextType = {
    performedSessions: PerformedSession[];
    setPerformedSessions: Dispatch<SetStateAction<PerformedSession[]>>;
}

const ExercisesContext = createContext<ExercisesContextType | undefined>(undefined);
const WorkoutsContext = createContext<WorkoutsContextType | undefined>(undefined);
const MuscleGroupsContext = createContext<MuscleGroupContextType | undefined>(undefined);
const PeformedSessionsContext = createContext<PerformedSessionContextType | undefined>(undefined);
const PlannedSessionsContext = createContext<PlannedSessionContextType | undefined>(undefined);

export function ExercisesProvider({ children }: { children: React.ReactNode }) {
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

export function PeformedSessionsProvider({ children }: { children: React.ReactNode }) {
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
        <PeformedSessionsContext.Provider value={{ performedSessions, setPerformedSessions }}>
            {children}
        </PeformedSessionsContext.Provider>
    );
}

export function PlannedSessionsProvider({ children }: { children: React.ReactNode }) {
    const [plannedSessions, setPlannedSessions] = useState<PlannedSession[]>([
        {
            id: 1,
            workoutId: 1,
            date: Date.now(),
            plannedExercises: [
                { id: 1, workoutExerciseId: 0, sets: 3, target: 25, weight: 20, rest: 60 },
                { id: 2, workoutExerciseId: 1, sets: 3, target: 30, weight: 0, rest: 60 },
                { id: 3, workoutExerciseId: 2, sets: 4, target: 12, weight: 44, rest: 60 },
                { id: 4, workoutExerciseId: 3, sets: 3, target: 11, weight: 0, rest: 60 },
                { id: 5, workoutExerciseId: 4, sets: 1, target: 15, weight: 0, rest: 60 },
                { id: 6, workoutExerciseId: 5, sets: 3, target: 17, weight: 0, rest: 60 },
            ]
        }
    ]);

    return (
        <PlannedSessionsContext.Provider value={{ plannedSessions, setPlannedSessions }}>
            {children}
        </PlannedSessionsContext.Provider>
    );
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
export function usePerformedSessionsContext() {
    const context = useContext(PeformedSessionsContext);
    if (!context) {
        throw new Error('usePerformedSessionsContext must be used within PeformedSessionsProvider')
    }
    return context;
}

export function usePlannedSessionsContext() {
    const context = useContext(PlannedSessionsContext);
    if (!context) {
        throw new Error('usePlannedSessionsContext must be used within PlannedSessionsProvider');
    }
    return context;
}

