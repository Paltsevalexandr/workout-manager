import React from 'react';
import styles from "../../page.module.scss";
import { Workout, PerformedSession } from '@/_types';
import { getLastSession } from '@/lib';
import ExerciseItem from './ExerciseItem';
import { useExercisesContext } from '@/app/providers';

type Props = {
    workout: Workout;
    performedSessions: PerformedSession[];
}

export default function ExerciseList({ workout, performedSessions }: Props) {
    const { exercises } = useExercisesContext();
    const lastSession = getLastSession(workout.id, performedSessions);

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
