import type { ExerciseDTO as Exercise } from "./data/exercises";

export const targets = ["reps", "duration"] as const;
export type Target = typeof targets[number];

export const days = [0, 1, 2, 3, 4, 5, 6];
export type Day = typeof days[number];

export type SessionFormSource = "none" | "prevSession" | "plan";
export type ModalType = "none" | "session" | "plan";

export type { Exercise };
export type { CategoryDTO as Category } from "@/data/categories";
export type { MuscleGroupDTO as MuscleGroup } from "@/data/muscleGroups";

export type Workout = {
    id: number;
    name: string;
    workoutExercises: WorkoutExercise[];
    status: "active" | "archived";
};

export type WorkoutExercise = {
    id: number | null;
    workoutTemplateId: Workout["id"] | null;
    exerciseId: Exercise["id"];
    isDeleted: boolean;
}

export type PerformedSession = {
    id: number | null;
    workoutId: Workout["id"];
    date: number;
    performedExercises: PerformedExercise[]
}

export type PerformedExercise = {
    id: number | null;
    workoutExerciseId: number;
    sets: number;
    target: number;
    weight: number;
    rest: number;
};

export type PlannedSession = {
    id: number | null;
    workoutId: Workout["id"];
    date: number;
    plannedExercises: PlannedExercise[]
}

export type PlannedExercise = {
    id: number | null;
    workoutExerciseId: number;
    sets: number;
    target: number;
    weight: number;
    rest: number;
};
