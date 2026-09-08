import React from 'react';
import styles from "../../page.module.scss";
import { Exercise, Workout, WorkoutSession } from '@/app/_types';

type Props = {
    exercises: Exercise[];
    workout: Workout;
    workoutSessions: WorkoutSession[];
    index: number;
}

export default function ExerciseList({ exercises, workout, index }: Props) {
    const visibleExercises = workout.exercises.slice(0, 4);
    const remaining = workout.exercises.length - 4;
    return (
        <ul className={styles.workoutExercises}>
            {
                visibleExercises.map((exercise, i) => {
                    let exerciseData = exercises.find(ex => ex.id == exercise);
                    if (!exerciseData) {
                        return null;
                    }
                    return (
                        <li key={`workout_exercise_${index}_${i}`}>
                            {exerciseData.name}
                        </li>
                    )
                })
            }
            {
                remaining > 0
                    ? <li key={`workout_exercise_last_${index}`}>
                        {`+ ${remaining} more`}
                    </li>
                    : null
            }
        </ul>
    )
}
