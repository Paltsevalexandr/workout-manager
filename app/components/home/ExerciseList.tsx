import React from 'react';
import styles from "../../page.module.scss";
import { Workout, WorkoutSession } from '@/_types';
import { getLastSession } from '@/lib';
import ExerciseItem from './ExerciseItem';
import { useExercisesContext } from '@/app/providers';

type Props = {
    workout: Workout;
    workoutSessions: WorkoutSession[];
}

export default function ExerciseList({ workout, workoutSessions }: Props) {
    const { exercises } = useExercisesContext();
    const lastSession = getLastSession(workout.id, workoutSessions);

    return (
        <ul className={styles.detailsExercises}>
            <li className={styles.detailsExercisesHeader}>
                <span className={styles.detailsExercisesHeaderName}>
                    Exercise Name
                </span>
                <span className={styles.detailsExercisesHeaderVolume}>
                    Sets &times; Reps/Dur.
                </span>
            </li>
            {
                workout.workoutExercises.map((workoutExercise, i) => {
                    return <ExerciseItem key={`workout_exercise_${i}`}
                        workoutExercise={workoutExercise}
                        exercises={exercises}
                        lastSession={lastSession}
                    />
                })
            }
        </ul>
    )
}
