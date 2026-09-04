export const categories = ["strength", "cardio", "mobility", "stretching"] as const;
export type Category = typeof categories[number];

export const muscleGroups = ["chest", "back", "legs", "shoulders", "arms", "core"] as const;
export type MuscleGroup = typeof muscleGroups[number];

export type Target = "reps" | "duration";

export type Exercise = {
    name: string;
    category: Category;
    muscleGroup: MuscleGroup;
    target: Target;
    useWeight: boolean;
};
