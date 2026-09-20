export const categories = ["strength", "cardio", "mobility", "stretching"] as const;
export type Category = typeof categories[number];

// export const muscleGroups = ["chest", "back", "legs", "shoulders", "arms", "core"] as const;
// export type MuscleGroup = typeof muscleGroups[number];

export const targets = ["reps", "duration"] as const;
export type Target = typeof targets[number];

export const days = [0, 1, 2, 3, 4, 5, 6];
export type Day = typeof days[number];

export type SessionFormSource = "none" | "prevSession" | "plan";
export type ModalType = "none" | "session" | "plan";

export type Exercise = {
    id: number;
    name: string;
    category: Category;
    muscleGroups: MuscleGroup[];
    target: Target;
};

export type MuscleGroup = {
    id: number;
    name: string;
    parentId: number | null;
    isSystem: boolean;
};

export type Workout = {
    id: number;
    name: string;
    workoutExercises: WorkoutExercise[];

    // tags: string[];
    // status: 'active' | 'archived';
    // createdAt: string;
    // archivedAt: string | null;
};

export type WorkoutExercise = {
    id: number | null;
    workoutTemplateId: Workout['id'] | null;
    exerciseId: Exercise['id'];
}

export type WorkoutSession = { // rename to PerformedSession
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

export type WorkoutPlan = { // rename to PlannedSession
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
