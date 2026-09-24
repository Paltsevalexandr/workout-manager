import React from 'react'
import { Exercise, PerformedExercise, WorkoutExercise, PerformedSession, PlannedSession } from '@/_types';
import styles from "../../page.module.scss";
import { useExercisesContext } from '@/app/providers';
import { getSourceExercises } from '@/lib';

type Props = {
    workoutExercise: WorkoutExercise;
    session: PerformedSession | PlannedSession;
}

export default function ExerciseItem({ workoutExercise, session }: Props) {
    const { exercises } = useExercisesContext();
    let exerciseData = exercises.find(ex => ex.id == workoutExercise.exerciseId);
    let sourceExercises = getSourceExercises(session);
    let sessionExercise = sourceExercises.find(
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
                    sessionExercise
                        ? `${sessionExercise.sets}\u00D7${sessionExercise.target}`
                        : ""
                }
            </span>
        </li>
    )
}
