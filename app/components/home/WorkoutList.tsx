"use client";

import { Dispatch, SetStateAction } from 'react';
import { Workout, WorkoutPlan, WorkoutSession } from '@/_types';
import styles from "../../page.module.scss";
import { getLastSession, getLastSessionDate } from '@/lib';
import { useWorkoutsContext } from '@/app/providers';
import WorkoutItem from './WorkoutItem';

type Props = {
    selectedWorkout: Workout | null;
    workoutSessions: WorkoutSession[];
    plannedSessions: WorkoutPlan[];
    setSelectedWorkout: Dispatch<SetStateAction<Workout | null>>;
    openCreateWorkoutModal: () => void;
    savePerformedSession: (workoutId: number) => void;
}

export default function WorkoutsList({
    workoutSessions,
    selectedWorkout,
    plannedSessions,
    setSelectedWorkout,
    openCreateWorkoutModal,
    savePerformedSession
}: Props) {
    const { workouts } = useWorkoutsContext();

    function sortWorkouts(workouts: Workout[]) {
        return [...workouts].sort((prev, current) => {
            const lastPrevSession = getLastSession(prev.id, workoutSessions);
            const lastCurrentSession = getLastSession(current.id, workoutSessions);

            const prevHasSession = lastPrevSession !== null;
            const currentHasSession = lastCurrentSession !== null;

            if (!prevHasSession && !currentHasSession) {
                return 0;
            }
            if (!prevHasSession) {
                return -1;
            }
            if (!currentHasSession) {
                return 1;
            }

            return lastPrevSession.date - lastCurrentSession.date; // сравнение по дате в обычном порядке (см. ниже)
        });
    }

    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <h2 className={styles.sidebarTitle}>
                    Workouts
                </h2>
                <button className={styles.sidebarAddWorkoutBtn + " button-secondary"}
                    onClick={openCreateWorkoutModal}>
                    Add Workout
                </button>
            </div>
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
                                savePerformedSession={() => savePerformedSession(workout.id)}
                            />
                        })
                    }
                </ul>
            </div>
        </div>
    )
}
