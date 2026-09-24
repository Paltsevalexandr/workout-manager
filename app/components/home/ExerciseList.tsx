import React from 'react';
import styles from "../../page.module.scss";
import { Workout, PerformedSession, PlannedSession } from '@/_types';
import ExerciseItem from './ExerciseItem';

type Props = {
    workout: Workout;
    session: PerformedSession | PlannedSession;
}

export default function ExerciseList({ workout, session }: Props) {
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
                        session={session}
                    />
                })
            }
        </ul>
    )
}
