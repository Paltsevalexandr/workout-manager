import React from 'react';
import ExerciseList from './ExerciseList';
import { capitalize } from '@/app/lib';
import styles from "../../page.module.scss";
import { Exercise, Workout, WorkoutSession } from '@/app/_types';

type Props = {
    workout: Workout;
    workoutSessions: WorkoutSession[],
    exercises: Exercise[];
    index: number;
    trackProgress: (index: number) => void;
}

export default function WorkoutItem({
    workout,
    workoutSessions,
    exercises,
    index,
    trackProgress
}: Props) {
    return (
        <li className={styles.workout}>
            <h4 className={styles.workoutName}>
                {capitalize(workout.name)}
            </h4>
            <ExerciseList
                exercises={exercises}
                workout={workout}
                workoutSessions={workoutSessions}
                index={index}
            />
            <div className={styles.workoutControls}>
                <button
                    onClick={() => trackProgress(index)}
                    className={styles.workoutTracking}
                >
                    Track Progress
                </button>
            </div>
        </li>
    )
}
