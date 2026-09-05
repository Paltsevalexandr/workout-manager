export const categories = ["strength", "cardio", "mobility", "stretching"] as const;
export type Category = typeof categories[number];

export const muscleGroups = ["chest", "back", "legs", "shoulders", "arms", "core"] as const;
export type MuscleGroup = typeof muscleGroups[number];

export const targets = ["reps", "duration"] as const;
export type Target = typeof targets[number];

export const days = [0, 1, 2, 3, 4, 5, 6];
export type Day = typeof days[number];

export type WorkoutExercise = {
    id: number | null;
    exerciseId: Exercise['id'];
    sets: number;
    target: number;
    weight?: number;
    rest: number;
};

export type Workout = {
    id: number;
    name: string;
    exercises: WorkoutExercise[];
    day: Day;
};

export type Exercise = {
    id: number;
    name: string;
    category: Category;
    muscleGroup: MuscleGroup;
    target: Target;
    useWeight: boolean;
};
