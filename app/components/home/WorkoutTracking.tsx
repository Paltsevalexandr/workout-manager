"use client";

import React, {
    useState,
    type SubmitEvent
} from 'react';
import styles from "../../page.module.scss";
import { useExercisesContext } from '@/app/providers';
import WorkoutsList from "./WorkoutList";
import { PerformedExercise, Workout, WorkoutSession } from '@/app/_types';
import WorkoutTrackingModal from './WorkoutTrackingModal';
import { generateID, getLastSession } from '@/lib';
import WorkoutDetails from './WorkoutDetails';

type Props = {}

export default function WorkoutTracking({ }: Props) {
    const { exercises } = useExercisesContext();
    const [isModalFormOpen, setIsModalFormOpen] = useState<boolean>(false);
    const [workoutSession, setWorkoutSession] = useState<WorkoutSession | null>(null);
    const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([
        {
            date: 1788894136955,
            id: 1,
            performedExercises: [
                { id: 1, workoutExerciseId: 0, sets: 1, target: 1, weight: 0, rest: 1 },
                { id: 2, workoutExerciseId: 1, sets: 1, target: 1, weight: 0, rest: 1 },
                { id: 3, workoutExerciseId: 2, sets: 1, target: 1, weight: 0, rest: 1 },
                { id: 4, workoutExerciseId: 3, sets: 1, target: 1, weight: 0, rest: 1 },
                { id: 5, workoutExerciseId: 4, sets: 1, target: 1, weight: 0, rest: 1 },
                { id: 6, workoutExerciseId: 5, sets: 1, target: 1, weight: 0, rest: 1 },


            ],
            workoutId: 1
        },
        {
            date: 1788894136955,
            id: 2,
            performedExercises: [
                { id: 7, workoutExerciseId: 6, sets: 1, target: 1, weight: 0, rest: 1 },
                { id: 8, workoutExerciseId: 7, sets: 1, target: 1, weight: 0, rest: 1 },
                { id: 9, workoutExerciseId: 8, sets: 1, target: 1, weight: 0, rest: 1 },
                { id: 10, workoutExerciseId: 9, sets: 1, target: 1, weight: 0, rest: 1 }

            ],
            workoutId: 2
        }
    ]);
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

    function trackProgress(workoutId: number, workouts: Workout[]) {
        setIsModalFormOpen(true);
        let performedExercises: PerformedExercise[] = [];
        // temp code
        let allPerformedExercises: PerformedExercise[] = [];
        workoutSessions.forEach(session => allPerformedExercises.push(...session.performedExercises));
        let newPerformedExerciseId = generateID(allPerformedExercises);
        // temp code end
        let latestSession = getLastSession(workoutId, workoutSessions);
        let workout = workouts.find(workout => workout.id == workoutId);
        workout?.workoutExercises.forEach((workoutExercise, i) => {
            if (workoutExercise.id != null) {
                // TODO - use prev session or planned session
                const latestPerformedExercise = latestSession?.performedExercises.find(
                    (ex) => ex.workoutExerciseId === workoutExercise.id
                );

                const newPerformedExercise: PerformedExercise = {
                    id: newPerformedExerciseId + i,
                    workoutExerciseId: workoutExercise.id,
                    sets: latestPerformedExercise?.sets ?? 1,
                    target: latestPerformedExercise?.target ?? 1,
                    weight: latestPerformedExercise?.weight ?? 0,
                    rest: latestPerformedExercise?.rest ?? 1,
                };

                performedExercises.push(newPerformedExercise);
            }
            else {
                console.warn("workoutExercise id is null", workoutExercise);
            }
        });
        setWorkoutSession({
            id: null,
            workoutId: workoutId,
            date: Date.now(),
            performedExercises
        })
    }
    function saveSession(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (workoutSession) {
            setWorkoutSessions(prevSessions => [
                ...prevSessions,
                {
                    ...workoutSession,
                    id: generateID(workoutSessions)
                }
            ])
        }
        setIsModalFormOpen(false);
        setWorkoutSession(null);
    }
    function cancelForm() {
        setIsModalFormOpen(false);
        setWorkoutSession(null);
    }

    function setDate(date: number) {
        setWorkoutSession((prevSession) => {
            if (!prevSession) {
                return null;
            }
            return {
                ...prevSession,
                date
            }
        });
    }

    function handlePerformedExerciseChange(value: number, workoutExerciseId: number, field: keyof PerformedExercise) {
        setWorkoutSession(prevWorkoutSession => {
            if (!prevWorkoutSession) {
                return prevWorkoutSession;
            }
            else {
                return {
                    ...prevWorkoutSession,
                    performedExercises: prevWorkoutSession.performedExercises.map((ex) => {
                        if (ex.workoutExerciseId == workoutExerciseId) {
                            return {
                                ...ex,
                                [field]: value
                            }
                        }
                        return ex;
                    })
                }
            }
        })
    }

    return (
        <main>
            <section>
                <div className="section-content">
                    <div className={styles.workoutColumns}>
                        <WorkoutsList
                            selectedWorkout={selectedWorkout}
                            workoutSessions={workoutSessions}
                            setSelectedWorkout={setSelectedWorkout}
                        />
                        <WorkoutDetails
                            workout={selectedWorkout}
                            workoutSessions={workoutSessions}
                            trackProgress={trackProgress}
                        />
                    </div>

                    <WorkoutTrackingModal
                        setDate={setDate}
                        workoutSession={workoutSession}
                        isModalFormOpen={isModalFormOpen}
                        saveSession={saveSession}
                        cancelForm={cancelForm}
                        handlePerformedExerciseChange={handlePerformedExerciseChange}
                    />
                </div>
            </section>
        </main>
    )
}
