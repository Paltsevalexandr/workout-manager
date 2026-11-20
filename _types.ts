import type { ExerciseDTO as Exercise } from "./data/exercises";
import type { SessionExerciseInput } from "./data/sessionHelper";
import type { WorkoutDTO as Workout } from "./data/workouts";

export const targets = ["reps", "duration"] as const;
export type Target = typeof targets[number];

export const days = [0, 1, 2, 3, 4, 5, 6];
export type Day = typeof days[number];

export type SessionFormSource = "none" | "prevSession" | "plan";
export type ModalType = "none" | "session" | "plan";

export type {
    WorkoutInput as WorkoutDraft,
    WorkoutExerciseInput as WorkoutExerciseDraft
} from "@/data/workouts";

export type { Exercise };
export type { CategoryDTO as Category } from "@/data/categories";
export type { MuscleGroupDTO as MuscleGroup } from "@/data/muscleGroups";
export type { Workout };
export type { WorkoutExerciseDTO as WorkoutExercise } from "@/data/workouts";

export type {
    PerformedSessionDTO as PerformedSession,
    PerformedExerciseDTO as PerformedExercise
} from "@/data/performedSessions";

export type {
    PlannedSessionDTO as PlannedSession,
    PlannedExerciseDTO as PlannedExercise,
} from "@/data/plannedSessions";

export type SessionExerciseDraft = SessionExerciseInput;

export type PerformedSessionDraft = {
    workoutId: number;
    date: number;
    performedExercises: SessionExerciseDraft[]
}

export type PlannedSessionDraft = {
    id: number | null;
    workoutId: number;
    date: number;
    plannedExercises: SessionExerciseDraft[]
}
