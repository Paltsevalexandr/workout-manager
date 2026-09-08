"use client";

import React, { useState, type SubmitEvent } from 'react';
import { PerformedExercise, Workout, WorkoutSession } from '@/app/_types';
import styles from "../../page.module.scss";
import { getExerciseById, getFormattedDate, generateID } from '@/app/lib';
import { useExercisesContext, useWorkoutsContext } from '@/app/providers';
import ModalForm from '../ui/ModalForm';
import Modal from '../ui/Modal';
import NumberField from '../forms/NumberField';
import WorkoutItem from './WorkoutItem';
import DateField from '../forms/DateField';

type Props = {}

export default function WorkoutsList({ }: Props) {
    const { exercises } = useExercisesContext();
    const { workouts } = useWorkoutsContext();
    const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);

    const [isModalFormOpen, setIsModalFormOpen] = useState<boolean>(false);
    const [workoutSession, setWorkoutSession] = useState<WorkoutSession | null>(null);

    function trackProgress(index: number) {
        setIsModalFormOpen(true);
        let performedExercises: PerformedExercise[] = [];
        // temp code
        let allPerformedExercises: PerformedExercise[] = [];
        workoutSessions.forEach(session => allPerformedExercises.push(...session.performedExercises))
        // temp code end
        workouts[index].exercises.forEach(exerciseId => {
            const exercise = exercises.find(exercise => exercise.id == exerciseId);
            if (exercise) {
                // TODO - use prev session or planned session
                performedExercises.push({
                    id: generateID(allPerformedExercises),
                    exerciseId: exercise.id,
                    sets: 1,
                    target: 1,
                    weight: 0,
                    rest: 1
                });
            }
        });
        setWorkoutSession({
            id: null,
            workoutId: workouts[index].id,
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
    function handlePerformedExerciseChange(value: number, index: number, field: keyof PerformedExercise) {
        setWorkoutSession(prevWorkoutSession => {
            if (!prevWorkoutSession) {
                return prevWorkoutSession;
            }
            else {
                return {
                    ...prevWorkoutSession,
                    performedExercises: prevWorkoutSession.performedExercises.map((ex, i) => {
                        if (i == index) {
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

    function formatRelativeDate(timestamp: number): string {
        const days = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        return `${days} days ago`;
    }
    return (
        <>
            <ul className={styles.workoutList}>
                {
                    workouts.map((workout, index) => {
                        let exercisesCompactText = "";
                        for (let i = 0; i < workout.exercises.length; i++) {
                            let exercise = workout.exercises[i];
                            let exerciseData = exercises.find(ex => ex.id == exercise);
                            if (exerciseData) {
                                if (i > 0) {
                                    exercisesCompactText += ", ";
                                }
                                exercisesCompactText += exerciseData.name;
                            }
                            if (exercisesCompactText.length > 30) {
                                break;
                            }
                        }
                        return <WorkoutItem
                            key={`workout_item_${index}`}
                            workout={workout}
                            exercises={exercises}
                            workoutSessions={workoutSessions}
                            index={index}
                            trackProgress={trackProgress}
                        />
                    })
                }
            </ul>
            {
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
            }
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
                                                    onChange={(value) => handlePerformedExerciseChange(value, index, "target")}
                                                />
                                                <NumberField
                                                    key={`workout_session_exercise_sets_${index}`}
                                                    label=""
                                                    name="workout-exercise-sets"
                                                    value={performedExercise.sets}
                                                    onChange={(value) => handlePerformedExerciseChange(value, index, "sets")}
                                                />
                                                <NumberField
                                                    key={`workout_session_exercise_rest_${index}`}
                                                    label=""
                                                    name="workout-exercise-rest"
                                                    value={performedExercise.rest}
                                                    onChange={(value) => handlePerformedExerciseChange(value, index, "rest")}
                                                />
                                                <NumberField
                                                    key={`workout_session_exercise_weight_${index}`}
                                                    label=""
                                                    name="workout-exercise-weight"
                                                    value={performedExercise.weight}
                                                    onChange={(value) => handlePerformedExerciseChange(value, index, "weight")}
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
