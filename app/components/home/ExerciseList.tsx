import React from 'react';
import styles from "../../page.module.scss";
import { Exercise, PerformedExercise, Workout, WorkoutSession } from '@/app/_types';
import { getLastSession } from '@/app/lib';

type Props = {
    exercises: Exercise[];
    workout: Workout;
    workoutSessions: WorkoutSession[];
    index: number;
}

export default function ExerciseList({ exercises, workout, workoutSessions, index }: Props) {
    const maxDisplayedExercises = 3;
    const visibleExercises = workout.exercises.slice(0, maxDisplayedExercises);
    const remaining = workout.exercises.length - maxDisplayedExercises;
    const lastSession = getLastSession(workout.id, workoutSessions);
    return (
        <ul className={styles.workoutExercises}>
            {
                visibleExercises.map((exercise, i) => {
                    let exerciseData = exercises.find(ex => ex.id == exercise);
                    let performedExercise: PerformedExercise | undefined = undefined;
                    if (!exerciseData) {
                        return null;
                    }
                    if (lastSession?.performedExercises) {
                        performedExercise = lastSession.performedExercises.find(exercise => exerciseData.id == exercise.exerciseId);
                    }
                    return (
                        <li key={`workout_exercise_${index}_${i}`}
                            className={styles.workoutExercise}>
                            {exerciseData.name} {performedExercise ? `${performedExercise.target}x${performedExercise.sets}` : ""}
                        </li>
                    )
                })
            }
            {
                remaining > 0
                    ? <li key={`workout_exercise_last_${index}`}
                        className={styles.workoutExerciseRemaining}>
                        {`+ ${remaining} more`}
                    </li>
                    : null
            }
        </ul>
    )
}
