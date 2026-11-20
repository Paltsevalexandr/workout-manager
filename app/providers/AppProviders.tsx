"use client";

import { WorkoutsProvider } from "./workouts";
import { ExercisesProvider } from "./exercises";
import { CategoriesProvider } from "./categories";
import { MuscleGroupsProvider } from "./muscleGroups";
import { PerformedSessionsProvider } from "./performedSessions";
import { PlannedSessionsProvider } from "./plannedSessions";
import { Category, Exercise, MuscleGroup, PerformedSession, PlannedSession, Workout } from "@/_types";

type Props = {
    children: React.ReactNode;
    workouts: Workout[];
    categories: Category[];
    muscleGroups: MuscleGroup[];
    exercises: Exercise[];
    performedSessions: PerformedSession[];
    plannedSessions: PlannedSession[];
}
export default function AppProviders({
    children, categories,
    muscleGroups, exercises,
    workouts, performedSessions,
    plannedSessions
}: Props) {
    return (
        <WorkoutsProvider workouts={workouts}>
            <ExercisesProvider exercises={exercises}>
                <CategoriesProvider categories={categories}>
                    <MuscleGroupsProvider muscleGroups={muscleGroups}>
                        <PerformedSessionsProvider performedSessions={performedSessions}>
                            <PlannedSessionsProvider plannedSessions={plannedSessions}>
                                {children}
                            </PlannedSessionsProvider>
                        </PerformedSessionsProvider>
                    </MuscleGroupsProvider>
                </CategoriesProvider>
            </ExercisesProvider>
        </WorkoutsProvider>
    );
}
