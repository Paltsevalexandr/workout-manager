"use client";

import React, { useEffect, useState, type SubmitEvent } from 'react';
import { PerformedExercise, Workout, WorkoutSession } from '@/app/_types';
import styles from "../../page.module.scss";
import { getExerciseById, getFormattedDate, generateID, getLastSession } from '@/app/lib';
import { useExercisesContext, useWorkoutsContext } from '@/app/providers';
import ModalForm from '../ui/ModalForm';
import Modal from '../ui/Modal';
import NumberField from '../forms/NumberField';
import WorkoutItem from './WorkoutItem';
import DateField from '../forms/DateField';

type Props = {}

export default function WorkoutsList({ }: Props) {
    const { exercises } = useExercisesContext();
    const { workouts, setWorkouts } = useWorkoutsContext();
    const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([
        {
            date: 1788894136955,
            id: 1,
            performedExercises: [
                { id: 1, exerciseId: 2, sets: 1, target: 1, weight: 0, rest: 1 },
                { id: 2, exerciseId: 1, sets: 1, target: 1, weight: 0, rest: 1 },
                { id: 3, exerciseId: 3, sets: 1, target: 1, weight: 0, rest: 1 },


            ],
            workoutId: 3
        },
        {
            date: 1788894136955,
            id: 2,
            performedExercises: [
                { id: 4, exerciseId: 2, sets: 1, target: 1, weight: 0, rest: 1 },
                { id: 5, exerciseId: 1, sets: 1, target: 1, weight: 0, rest: 1 },
                { id: 6, exerciseId: 3, sets: 1, target: 1, weight: 0, rest: 1 }

            ],
            workoutId: 5
        }
    ]);

    const [isModalFormOpen, setIsModalFormOpen] = useState<boolean>(false);
    const [workoutSession, setWorkoutSession] = useState<WorkoutSession | null>(null);

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

    function trackProgress(workoutId: number, workouts: Workout[]) {
        setIsModalFormOpen(true);
        let performedExercises: PerformedExercise[] = [];
        // temp code
        let allPerformedExercises: PerformedExercise[] = [];
        workoutSessions.forEach(session => allPerformedExercises.push(...session.performedExercises));
        // temp code end
        let newPerformedExerciseId = generateID(allPerformedExercises);
        let j = 0;
        workouts.find(workout => workout.id == workoutId)?.exercises.forEach(exerciseId => {
            const exercise = exercises.find(exercise => exercise.id == exerciseId);
            if (exercise) {
                // TODO - use prev session or planned session
                performedExercises.push({
                    id: newPerformedExerciseId + j,
                    exerciseId: exercise.id,
                    sets: 1,
                    target: 1,
                    weight: 0,
                    rest: 1
                });
                j++;
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
    function handlePerformedExerciseChange(value: number, exerciseId: number, field: keyof PerformedExercise) {
        setWorkoutSession(prevWorkoutSession => {
            if (!prevWorkoutSession) {
                return prevWorkoutSession;
            }
            else {
                return {
                    ...prevWorkoutSession,
                    performedExercises: prevWorkoutSession.performedExercises.map((ex, i) => {
                        if (ex.exerciseId == exerciseId) {
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
        <>
            <ul className={styles.workoutList}>
                {
                    sortWorkouts(workouts).map((workout, index) => {
                        return <WorkoutItem
                            key={`workout_item_${index}`}
                            workout={workout}
                            exercises={exercises}
                            workoutSessions={workoutSessions}
                            index={index}
                            trackProgress={(workoutId: number) => trackProgress(workoutId, workouts)}
                        />
                    })
                }
            </ul>
            {/* {
                workoutSessions.map((session, i) => {
                    return (
                        <div className={styles.test} key={"foo" + i}>
                            <p key={"index" + i}>index {i}</p>
                            <p key={"date" + i}>Date: {getFormattedDate(session.date)}</p>
                            <p key={"bar" + i}>workoutId: {session.workoutId}</p>
                            <p key={"foobar" + i}>Exercises: {session.performedExercises.length}</p>
                        </div>
                    )
                })
            } */}
            {
                isModalFormOpen
                &&
                <Modal
                    onClose={cancelForm}
                >
                    <ModalForm
                        modalName="Track Progress"
                        submitText="Save Progress"
                        onSubmit={saveSession}
                        onCancel={cancelForm}
                    >
                        {
                            workoutSession &&
                            <DateField
                                label="Workout Date"
                                max={Date.now()}
                                name="workout_session_date"
                                value={getFormattedDate(workoutSession.date)}
                                onChange={(date) => setWorkoutSession((prevSession) => {
                                    if (!prevSession) {
                                        return null;
                                    }
                                    return {
                                        ...prevSession,
                                        date
                                    }
                                })}

                            />
                        }
                        {
                            workoutSession &&
                            <div className={styles.workoutSession}>
                                <div className={styles.workoutSessionHeader}>
                                    <div>Exercise Name</div>
                                    <div>Reps/Dur.</div>
                                    <div>Sets</div>
                                    <div>Rest</div>
                                    <div>Weight</div>
                                </div>
                                {
                                    workoutSession.performedExercises.map((performedExercise, index) => {
                                        let exercise = getExerciseById(exercises, performedExercise.exerciseId);
                                        if (!exercise) {
                                            return null;
                                        }
                                        return (
                                            <div key={`workout_session_exercise_${index}`}
                                                className={styles.workoutSessionExercise}>
                                                <p key={`workout_session_exercise_${index}`}>
                                                    {exercise.name}
                                                </p>
                                                <NumberField
                                                    key={`workout_session_exercise_target_${index}`}
                                                    label=""
                                                    name="workout-exercise-target"
                                                    value={performedExercise.target}
                                                    onChange={(value) => handlePerformedExerciseChange(value, performedExercise.exerciseId, "target")}
                                                />
                                                <NumberField
                                                    key={`workout_session_exercise_sets_${index}`}
                                                    label=""
                                                    name="workout-exercise-sets"
                                                    value={performedExercise.sets}
                                                    onChange={(value) => handlePerformedExerciseChange(value, performedExercise.exerciseId, "sets")}
                                                />
                                                <NumberField
                                                    key={`workout_session_exercise_rest_${index}`}
                                                    label=""
                                                    name="workout-exercise-rest"
                                                    value={performedExercise.rest}
                                                    onChange={(value) => handlePerformedExerciseChange(value, performedExercise.exerciseId, "rest")}
                                                />
                                                <NumberField
                                                    key={`workout_session_exercise_weight_${index}`}
                                                    label=""
                                                    name="workout-exercise-weight"
                                                    value={performedExercise.weight}
                                                    onChange={(value) => handlePerformedExerciseChange(value, performedExercise.exerciseId, "weight")}
                                                />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }


                    </ModalForm>
                </Modal>
            }
        </>
    )
}
