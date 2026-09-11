import React from 'react'
import { Exercise, PerformedExercise, WorkoutExercise, WorkoutSession } from '@/app/_types';
import styles from "../../page.module.scss";

type Props = {
    exercises: Exercise[];
    workoutExercise: WorkoutExercise;
    lastSession: WorkoutSession | null;
}

export default function ExerciseItem({ exercises, workoutExercise, lastSession }: Props) {
    let exerciseData = exercises.find(ex => ex.id == workoutExercise.exerciseId);
    let performedExercise = lastSession?.performedExercises.find(
        (exercise) => workoutExercise.id == exercise.workoutExerciseId
    );
    if (!exerciseData) {
        return null;
    }
    return (
        <li className={styles.detailsExercise}>
            <span className={styles.detailsExerciseName}>
                {exerciseData.name}
            </span>
            <span className={styles.detailsExerciseVolume}>
                {
                    performedExercise
                        ? `${performedExercise.sets}\u00D7${performedExercise.target}`
                        : ""
                }
            </span>
        </li>
    )
}
