import React, { Dispatch, SetStateAction } from 'react';
import { capitalize, formatRelativeDate, getExercisesLabel } from '@/lib';
import styles from "../../page.module.scss";
import { Exercise, Workout, } from '@/app/_types';
import { Clock, AlertCircle, ThumbsUp, Dumbbell } from 'lucide-react';
import { ChevronRight } from "lucide-react";

type Props = {
    selectedWorkout: Workout | null;
    workout: Workout;
    lastSessionDate: number | null,
    exercises: Exercise[];
    index: number;
    trackProgress: (workoutId: number) => void;
    setSelectedWorkout: () => void;
}

export default function WorkoutItem({
    selectedWorkout,
    workout,
    lastSessionDate,
    trackProgress,
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
    const exercisesAmount = workout.exercises.length;
    return (
        <li className={`${styles.workout} ${selectedWorkout?.id == workout.id ? styles.active : ""}`}
            onClick={() => setSelectedWorkout()}>
            <div className={styles.workoutLeft}>
                <h4 className={styles.workoutName}>
                    {capitalize(workout.name)}
                </h4>
                <p className={`${styles.workoutLastDate} ${lastSessionClass}`}>
                    {lastSessionIcon} {lastRelativeDate}
                </p>

            </div>
            {/* <div className={styles.workoutRight}>
                <p className={styles.workoutExercisesAmount}>
                    {getExercisesLabel(exercisesAmount)}
                </p>
            </div> */}

        </li>
    )
}
{/* <div className={styles.workoutIconWrap}>
                <ChevronRight size={16} />
            </div> */}
