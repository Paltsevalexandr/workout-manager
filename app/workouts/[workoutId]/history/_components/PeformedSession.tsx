import React from 'react';
import { formatFullDate } from '@/lib';
import { ChevronDown, ChevronUp } from "lucide-react";
import Dropdown from '@/app/components/ui/Dropdown';
import { Workout, WorkoutSession } from '@/_types';
import styles from "../page.module.scss";
import PerformedExerciseItem from './PerformedExerciseItem';

type Props = {
    workout: Workout;
    session: WorkoutSession;
    isExpanded: boolean;
    toggleSessionDropdown: () => void;
}

export default function PeformedSession({
    workout,
    isExpanded,
    session,
    toggleSessionDropdown,

}: Props) {
    const exercisesAmount = workout.workoutExercises.length;
    return (
        <li className={styles.performedSession + " " + (isExpanded ? "active" : "")}>
            <h3 className={styles.performedSessionHeader}
                onClick={toggleSessionDropdown}>
                <span>{formatFullDate(session.date)}</span>
                <div className={styles.performedSessionHeaderRight}>
                    <span>
                        {`${workout.workoutExercises.length} exercise${exercisesAmount > 1 ? 's':''}`} 
                    </span>
                    <button className={styles.performedSessionDetailsBtn}>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
            </h3>
            <Dropdown isExpanded={isExpanded}>
                <ul className={styles.performedSessionExercisesList}>
                    <li className={styles.performedSessionExerciseListHeader}>
                        <div className={styles.performedSessionExerciseListHeaderExercise}>
                            Exercise
                        </div>
                        <div className={styles.performedSessionExerciseListHeaderData}>
                            Sets × Reps &bull; Weight &bull; Rest
                        </div>
                    </li>
                    {
                        session.performedExercises.map(performedExercise => {
                            return (
                                <PerformedExerciseItem
                                    key={`session_${session.id}_${performedExercise.id}`}
                                    workout={workout}
                                    performedExercise={performedExercise}
                                />
                            )
                        })
                    }
                </ul>
            </Dropdown>
        </li>
    )
}
