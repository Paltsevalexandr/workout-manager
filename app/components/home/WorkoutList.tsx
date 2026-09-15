"use client";

import React, { Dispatch, SetStateAction } from 'react';
import { Workout, WorkoutPlan, WorkoutSession } from '@/_types';
import styles from "../../page.module.scss";
import { getLastSession, getLastSessionDate } from '@/lib';
import { useExercisesContext, useWorkoutsContext } from '@/app/providers';
import WorkoutItem from './WorkoutItem';


type Props = {
    selectedWorkout: Workout | null;
    workoutSessions: WorkoutSession[];
    plannedSessions: WorkoutPlan[];
    setSelectedWorkout: Dispatch<SetStateAction<Workout | null>>;
}

export default function WorkoutsList({
    workoutSessions,
    selectedWorkout,
    plannedSessions,
    setSelectedWorkout,
}: Props) {
    const { exercises } = useExercisesContext();
    const { workouts } = useWorkoutsContext();

    function sortWorkouts(workouts: Workout[]) {
        return [...workouts].sort((prev, current) => {
            const lastPrevSession = getLastSession(prev.id, workoutSessions);
            const lastCurrentSession = getLastSession(current.id, workoutSessions);

            const prevHasSession = lastPrevSession !== null;
            const currentHasSession = lastCurrentSession !== null;

            if (!prevHasSession && !currentHasSession) {
                return 0; // у обоих нет сессий — порядок между ними неважен
            }
            if (!prevHasSession) {
                return -1; // prev без сессии — идёт первым
            }
            if (!currentHasSession) {
                return 1; // current без сессии — идёт первым
            }

            return lastPrevSession.date - lastCurrentSession.date; // сравнение по дате в обычном порядке (см. ниже)
        });
    }

    return (
        <div className={styles.sidebar}>
            <h2 className={styles.sidebarTitle}>
                Workouts
            </h2>
            <div className={styles.sidebarListWrap}>
                <ul className={styles.sidebarList}>
                    {
                        sortWorkouts(workouts).map((workout, index) => {
                            return <WorkoutItem
                                key={`workout_item_${index}`}
                                workout={workout}
                                plannedSessions={plannedSessions}
                                selectedWorkout={selectedWorkout}
                                setSelectedWorkout={() => setSelectedWorkout(workout)}
                                lastSessionDate={getLastSessionDate(workout.id, workoutSessions)}
                            />
                        })
                    }
                </ul>
            </div>
        </div>
    )
}
