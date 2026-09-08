import React from 'react';
import ExerciseList from './ExerciseList';
import { capitalize, formatRelativeDate, getLastSessionDate } from '@/app/lib';
import styles from "../../page.module.scss";
import { Exercise, Workout, WorkoutSession } from '@/app/_types';
import { Clock } from 'lucide-react';

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
    const lastSessionDate: number | null = getLastSessionDate(workout.id, workoutSessions);
    const lastRelativeDate: string = formatRelativeDate(lastSessionDate);
    const lastSessionClass = "";
    if (lastSessionDate != null) {
        const week = 1000 * 60 * 60 * 24 * 7;
        lastSessionDate + week < Date.now()
            ? styles.workoutLastDateLongAgo
            : styles.workoutLastDateExists
    }
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
            <div className={styles.workoutFooter}>
                <p className={`${styles.workoutLastDate} ${lastSessionClass}`}>
                    <Clock size={16} /> {lastRelativeDate}
                </p>
                <div className={styles.workoutControls}>
                    <button
                        onClick={() => trackProgress(index)}
                        className={styles.workoutTracking + " button-secondary"}
                    >
                        Track Progress
                    </button>
                </div>
            </div>
        </li>
    )
}
