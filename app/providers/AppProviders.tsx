"use client";

import { WorkoutsProvider } from "./workouts";
import { ExercisesProvider } from "./exercises";
import { CategoriesProvider } from "./categories";
import { MuscleGroupsProvider } from "./muscleGroups";
import { PerformedSessionsProvider } from "./performedSessions";
import { PlannedSessionsProvider } from "./plannedSessions";

export default function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <WorkoutsProvider>
            <ExercisesProvider>
                <CategoriesProvider>
                    <MuscleGroupsProvider>
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
