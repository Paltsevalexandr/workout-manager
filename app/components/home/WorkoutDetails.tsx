import { useEffect, useRef, useState } from 'react';
import styles from "../../page.module.scss";
import { Workout, WorkoutSession } from '@/_types';
import ExerciseList from './ExerciseList';
import { formatRelativeDate, getExercisesLabel, getLastSessionDate, getStatusClass } from '@/lib';
import { Ellipsis } from "lucide-react";

type Props = {
    workout: Workout;
    workoutSessions: WorkoutSession[];
    savePerformedSession: (workoutId: number) => void;
    createNextSessionPlan: (workoutId: number) => void;
}

export default function WorkoutDetails({
    workout,
    workoutSessions,
    savePerformedSession,
    createNextSessionPlan

}: Props) {
    const [isMenuDisplayed, setIsMenuDisplayed] = useState<boolean>(false);
    const lastSessionDate = getLastSessionDate(workout.id, workoutSessions);
    const lastSessionClass = getStatusClass(lastSessionDate, styles);
    const lastRelativeDate: string = formatRelativeDate(lastSessionDate);
    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!isMenuDisplayed) return;

        function handleOutsideClick(e: MouseEvent) {
            // TODO - figure what does the next line mean
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuDisplayed(false);
            }
        }

        document.addEventListener('click', handleOutsideClick);
        return () => document.removeEventListener('click', handleOutsideClick);
    }, [isMenuDisplayed]);

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
                        onClick={() => savePerformedSession(workout.id)}>
                        Track Progress
                    </button>
                    <button className={`button-secondary ${styles.detailsMenuTrigger}`}
                        onClick={() => { setIsMenuDisplayed(prev => !prev) }}>
                        <Ellipsis size={16} />
                    </button>
                    <div ref={menuRef}
                        className={styles.detailsMenuWrap + ` ${isMenuDisplayed ? styles.active : ""}`}>
                        <div className={styles.detailsMenuContainer}>
                            <ul className={styles.detailsMenu}>
                                <li className={styles.detailsMenuItem}>
                                    <button onClick={() => createNextSessionPlan(workout.id)}
                                        className={styles.detailsMenuButton}>
                                        Plan Next Session
                                    </button>
                                </li>
                                <li className={styles.detailsMenuItem}>
                                    <button className={styles.detailsMenuButton}>
                                        History
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
