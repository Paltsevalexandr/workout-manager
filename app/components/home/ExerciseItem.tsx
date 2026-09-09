import React from 'react'
import { Exercise, PerformedExercise, WorkoutSession } from '@/app/_types';
import styles from "../../page.module.scss";

type Props = {
    exercises: Exercise[];
    exerciseId: number;
    lastSession: WorkoutSession | null;
}

export default function ExerciseItem({ exercises, exerciseId, lastSession}: Props) {
    let exerciseData = exercises.find(ex => ex.id == exerciseId);
    let performedExercise: PerformedExercise | undefined = undefined;
    if (!exerciseData) {
        return null;
    }
    if (lastSession?.performedExercises) {
        performedExercise = lastSession.performedExercises.find(exercise => exerciseData.id == exercise.exerciseId);
    }
    return (
        <li className={styles.workoutExercise}>
            <span>
                {exerciseData.name}
            </span>
            <span>
                {
                    performedExercise
                        ? `${performedExercise.target}x${performedExercise.sets}`
                        : ""
                }
            </span>
        </li>
    )
}
