"use client";

import { WorkoutsProvider } from "./workouts";
import { ExercisesProvider } from "./exercises";
import { CategoriesProvider } from "./categories";
import { MuscleGroupsProvider } from "./muscleGroups";
import { PerformedSessionsProvider } from "./performedSessions";
import { PlannedSessionsProvider } from "./plannedSessions";
import { Category, MuscleGroup } from "@/_types";

type Props = {
    children: React.ReactNode;
    categories: Category[];
    muscleGroups: MuscleGroup[],
}
export default function AppProviders({ children, categories, muscleGroups }: Props) {
    return (
        <WorkoutsProvider>
            <ExercisesProvider>
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
