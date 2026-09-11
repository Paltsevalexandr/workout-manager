import React from 'react';
import styles from "../../page.module.scss";
import { Workout, WorkoutSession } from '@/app/_types';
import ExerciseList from './ExerciseList';
import { formatRelativeDate, getExercisesLabel, getLastSession, getLastSessionDate, getStatusClass } from '@/lib';

type Props = {
    workout: Workout | null;
    workoutSessions: WorkoutSession[];
}

export default function WorkoutDetails({
    workout,
    workoutSessions

}: Props) {
    if (!workout) {
        return null;
    }
    const lastSessionDate = getLastSessionDate(workout.id, workoutSessions);
    const lastSessionClass = getStatusClass(lastSessionDate, styles);
    const lastRelativeDate: string = formatRelativeDate(lastSessionDate);

    return (
        <div className={styles.details}>
            <h2 className={styles.detailsTitle}>
                {workout.name}
            </h2>
            <p className={styles.detailsMetaData}>
                <span className={lastSessionClass}>
                    {lastRelativeDate}
                </span>
                <span>&bull;</span>
                <span>{getExercisesLabel(workout.workoutExercises.length)}</span>
            </p>
            <div className={styles.workoutDetailsContent}>
                <ExerciseList
                    workout={workout}
                    workoutSessions={workoutSessions}
                />
            </div>
        </div>
    )
}
