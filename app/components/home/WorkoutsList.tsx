"use client";

import { Workout } from '@/app/_types';
import React, { useState } from 'react';
import styles from "../../page.module.scss";
import { capitalize } from '@/app/lib';
import { useExercisesContext, useWorkoutsContext } from '@/app/providers';

type Props = {}

export default function WorkoutsList({ }: Props) {
    const { exercises } = useExercisesContext();
    const { workouts } = useWorkoutsContext();
    
    return (
        <ul className={styles.workoutsList}>
            {
                workouts.map((workout, index) => {
                    let exercisesCompactText = "";
                    for (let i = 0; i < workout.exercises.length; i++) {
                        let exercise = workout.exercises[i];
                        let exerciseData = exercises.find(ex => ex.id == exercise);
                        if (exerciseData) {
                            if (i > 0) {
                                exercisesCompactText += ", ";
                            }
                            exercisesCompactText += exerciseData.name;
                        }
                        if (exercisesCompactText.length > 30) {
                            break;
                        }
                    }
                    return (
                        <li key={"workout_" + index}
                            className={styles.workout}>
                            <h4 className={styles.workoutName}
                                key={"workout_name_" + index}>
                                {capitalize(workout.name)}
                            </h4>
                            <ul className={styles.workoutExercises}
                                key={`workout_exercises_${index}`}>
                                {
                                    workout.exercises.map((exercise, i) => {
                                        let exerciseData = exercises.find(ex => ex.id == exercise);
                                        if (exerciseData && i < 4) {
                                            return (
                                                <li key={`workout_exercise_${index}_${i}`}>
                                                    {exerciseData.name}
                                                </li>
                                            )
                                        }
                                        return null;
                                    })
                                }
                                {
                                    workout.exercises.length > 4
                                        ? <li key={`workout_exercise_last_${index}`}>
                                            {`+ ${workout.exercises.length - 4} more`}
                                        </li>
                                        : null
                                }
                            </ul>
                        </li>
                    )
                })
            }
        </ul>
    )
}
