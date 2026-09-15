import React from 'react';
import { capitalize, formatRelativeDate, getExercisesLabel, getPlannedSession } from '@/lib';
import styles from "../../page.module.scss";
import { Workout, WorkoutPlan, } from '@/_types';
import { Clock, AlertCircle, CalendarCheck, Dumbbell } from 'lucide-react';

type Props = {
    selectedWorkout: Workout | null;
    workout: Workout;
    lastSessionDate: number | null,
    plannedSessions: WorkoutPlan[];
    setSelectedWorkout: () => void;
}

export default function WorkoutItem({
    selectedWorkout,
    workout,
    lastSessionDate,
    plannedSessions,
    setSelectedWorkout
}: Props) {
    const lastRelativeDate: string = formatRelativeDate(lastSessionDate);
    let iconSize = 16;
    let lastSessionClass = "";
    let lastSessionIcon = <Clock size={iconSize} />;
    if (lastSessionDate != null) {
        const week = 1000 * 60 * 60 * 24 * 7;

        if (lastSessionDate + week < Date.now()) { // long time ago
            lastSessionIcon = <AlertCircle size={iconSize} />
            lastSessionClass = styles.workoutLastDateLongAgo;
        }
        else {
            lastSessionIcon = <Dumbbell size={iconSize} />
            lastSessionClass = styles.workoutLastDateRecent;
        }
    }
    const exercisesAmount = workout.workoutExercises.length;
    const hasPlan: WorkoutPlan | null = getPlannedSession(workout.id, plannedSessions);
    return (
        <li className={`${styles.workout} ${selectedWorkout?.id == workout.id ? styles.active : ""}`}
            onClick={() => setSelectedWorkout()}>
            <div className={styles.workoutTop}>
                <h4 className={styles.workoutName}>
                    {capitalize(workout.name)}
                </h4>
                {
                    hasPlan && <CalendarCheck size={16} />
                }
            </div>
            <div className={styles.workoutBottom}>
                <p className={`${styles.workoutLastDate} ${lastSessionClass}`}>
                    {lastSessionIcon} {lastRelativeDate}
                </p>
                <p className={styles.workoutExercisesAmount}>
                    {getExercisesLabel(exercisesAmount)}
                </p>
            </div>
        </li>
    )
}
