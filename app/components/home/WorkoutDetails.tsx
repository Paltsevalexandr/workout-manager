import React, { useState } from 'react';
import styles from "../../page.module.scss";
import { Workout, WorkoutSession } from '@/app/_types';
import ExerciseList from './ExerciseList';
import { formatRelativeDate, getExercisesLabel, getLastSessionDate, getStatusClass } from '@/lib';
import { useWorkoutsContext } from '@/app/providers';
import { Ellipsis } from "lucide-react";

type Props = {
    workout: Workout | null;
    workoutSessions: WorkoutSession[];
    trackProgress: (workoutId: number, workouts: Workout[]) => void;
}

export default function WorkoutDetails({
    workout,
    workoutSessions,
    trackProgress

}: Props) {
    if (!workout) {
        return null;
    }
    const { workouts } = useWorkoutsContext();
    const [isMenuDisplayed, setIsMenuDisplayed] = useState<boolean>(false);
    const lastSessionDate = getLastSessionDate(workout.id, workoutSessions);
    const lastSessionClass = getStatusClass(lastSessionDate, styles);
    const lastRelativeDate: string = formatRelativeDate(lastSessionDate);

    return (
        <div className={styles.details}>
            <div className={styles.detailsHeader}>
                <div className={styles.detailsHeaderLeft}>
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
                </div>
                <div className={styles.detailsHeaderRight}>
                    <button className={`button-secondary`}
                        onClick={() => trackProgress(workout.id, workouts)}>
                        Track Progress
                    </button>
                    <button className={`button-secondary ${styles.detailsMenuTrigger}`}
                        onClick={() => { setIsMenuDisplayed(prev => !prev) }}>
                        <Ellipsis size={16} />
                    </button>
                    <div className={styles.detailsMenuWrap + ` ${isMenuDisplayed ? styles.active : ""}`}>
                        <div className={styles.detailsMenuContainer}>
                            <ul className={styles.detailsMenu}>
                                <li className={styles.detailsMenuItem}>
                                    <button className={styles.detailsMenuButton}>
                                        History
                                    </button>
                                </li>
                                <li className={styles.detailsMenuItem}>
                                    <button className={styles.detailsMenuButton}>
                                        Foobar
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.workoutDetailsContent}>
                <ExerciseList
                    workout={workout}
                    workoutSessions={workoutSessions}
                />
            </div>
        </div>
    )
}
