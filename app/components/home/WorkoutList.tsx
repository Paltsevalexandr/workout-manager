"use client";

import { Workout, PlannedSession, PerformedSession } from '@/_types';
import styles from "../../page.module.scss";
import { getLastSession, getLastSessionDate } from '@/lib';
import { useWorkoutsContext } from '@/app/providers';
import WorkoutItem from './WorkoutItem';
import { Plus } from 'lucide-react';

type Props = {
    selectedWorkout: Workout | null;
    performedSessions: PerformedSession[];
    plannedSessions: PlannedSession[];
    setSelectedWorkout: (workout: Workout) => void;
    openCreateWorkoutModal: () => void;
    savePerformedSession: (workoutId: number) => void;
}

export default function WorkoutsList({
    performedSessions,
    selectedWorkout,
    plannedSessions,
    setSelectedWorkout,
    openCreateWorkoutModal,
    savePerformedSession
}: Props) {
    const { workouts } = useWorkoutsContext();

    function sortWorkouts(workouts: Workout[]) {
        return workouts.filter(workout => workout.status !== "archived")
            .sort((prev, current) => {
            const lastPrevSession = getLastSession(prev.id, performedSessions);
            const lastCurrentSession = getLastSession(current.id, performedSessions);

            const prevHasSession = lastPrevSession !== null;
            const currentHasSession = lastCurrentSession !== null;

            if (!prevHasSession && !currentHasSession) {
                return prev.name.localeCompare(current.name);
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
                    <Plus size={16} /> Add Workout
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
                                lastSessionDate={getLastSessionDate(workout.id, performedSessions)}
                                savePerformedSession={() => savePerformedSession(workout.id)}
                            />
                        })
                    }
                </ul>
            </div>
        </div>
    )
}
