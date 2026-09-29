import React from 'react';
import styles from "../../page.module.scss";
import { Workout, PerformedSession, PlannedSession } from '@/_types';
import ExerciseItem from './ExerciseItem';
import { getSourceExercises } from '@/lib';

type Props = {
    workout: Workout;
    session: PerformedSession | PlannedSession;
}

export default function ExerciseList({ workout, session }: Props) {
    const sourceExercises = getSourceExercises(session);
    const hasWeight = sourceExercises.some(exercise => exercise.weight > 0);
    return (
        <ul className={styles.detailsExercises}>
            <li className={styles.detailsExercisesHeader}>
                <div className={styles.detailsExercisesHeaderName}>
                    Exercise Name
                </div>
                <div className={`${styles.detailsExercisesHeaderInfo} ${hasWeight ? styles.hasWeight : ""}`}>
                    {
                        hasWeight &&
                        <span className={styles.detailsExercisesHeaderWeight}>
                            Weight
                        </span>
                    }
                    <span className={styles.detailsExercisesHeaderVolume}>
                        Sets &times; Reps/Dur.
                    </span>
                    <span className={styles.detailsExercisesHeaderRest}>
                        Rest
                    </span>
                </div>
            </li>
            {
                workout.workoutExercises.map((workoutExercise) => {
                    return <ExerciseItem key={`workout_exercise_${workoutExercise.id}`}
                        workoutExercise={workoutExercise}
                        sourceExercises={sourceExercises}
                        hasWeight={hasWeight}
                    />
                })
            }
        </ul>
    )
}
