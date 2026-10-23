"use client";

import { WorkoutsProvider } from "./workouts";
import { ExercisesProvider } from "./exercises";
import { CategoriesProvider } from "./categories";
import { MuscleGroupsProvider } from "./muscleGroups";
import { PerformedSessionsProvider } from "./performedSessions";
import { PlannedSessionsProvider } from "./plannedSessions";
import { Category, Exercise, MuscleGroup } from "@/_types";

type Props = {
    children: React.ReactNode;
    categories: Category[];
    muscleGroups: MuscleGroup[];
    exercises: Exercise[];
}
export default function AppProviders({ children, categories, muscleGroups, exercises }: Props) {
    return (
        <WorkoutsProvider>
            <ExercisesProvider exercises={exercises}>
                <CategoriesProvider categories={categories}>
                    <MuscleGroupsProvider muscleGroups={muscleGroups}>
                        <PerformedSessionsProvider>
                            <PlannedSessionsProvider>
                                {children}
                            </PlannedSessionsProvider>
                        </PerformedSessionsProvider>
                    </MuscleGroupsProvider>
                </CategoriesProvider>
            </ExercisesProvider>
        </WorkoutsProvider>
    );
}
