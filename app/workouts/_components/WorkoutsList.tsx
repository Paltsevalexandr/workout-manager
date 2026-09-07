import React, { useState } from 'react'
import { Workout, Exercise } from '@/app/_types';
import { capitalize, getDayName } from "../../lib";
import styles from "../page.module.scss";
import WorkoutMenu from './WorkoutMenu';

type Props = {
    workouts: Workout[],
    exercises: Exercise[]
}

export default function WorkoutsList({ workouts, exercises }: Props) {
    const [openWorkoutMenuIndex, setOpenWorkoutMenuIndex] = useState<number | null>(null);
    // function getExerciseTargetLabel(workoutExercise: WorkoutExercise, exercise: Exercise) {
    //     return exercise.target == "reps"
    //         ? workoutExercise.target > 1 ? "reps" : "rep"
    //         : exercise.target;
    // }
    // function getExerciseSetsLabel(workoutExercise: WorkoutExercise) {
    //     return workoutExercise.sets > 1 ? "sets" : "set"
    // }
    // function getExerciseText(workoutExercise: WorkoutExercise, exercise: Exercise) {
    //     return `
    //         ${workoutExercise.target} 
    //         ${getExerciseTargetLabel(workoutExercise, exercise)} 
    //         x ${workoutExercise.sets} 
    //         ${getExerciseSetsLabel(workoutExercise)}
    //     `;
    // }

    
    return (
        workouts.length == 0
            ? <p>You don't have any workouts. Start adding your routines</p>
            : <ul className={styles.workoutsList}>
                {
                    workouts.map((workout, index) => {
                        return (
                            <li className={styles.workout}
                                key={"workout_" + index}>
                                <div key={"workout_header_" + index}
                                    className={styles.workoutHeader}>
                                    <WorkoutMenu
                                        openWorkoutMenuIndex={ openWorkoutMenuIndex }
                                        setOpenWorkoutMenuIndex={ setOpenWorkoutMenuIndex}
                                        index={index}
                                    />
                                    <h4 className={styles.workoutName}
                                        key={"workout_name_" + index}>
                                        {capitalize(workout.name)}
                                    </h4>
                                </div>
                                <ul key={"workout_exercises_" + index}>
                                    {
                                        workout.exercises.map((workoutExerciseID, index) => {
                                            let exercise = exercises.find(exercise => {
                                                return exercise.id == workoutExerciseID
                                            });

                                            return (
                                                <li key={"exercise_" + index}
                                                    className={styles.workoutExercise}>
                                                    <p>{exercise?.name ?? "Unknown"}</p>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </li>
                        )
                    })
                }
            </ul>
    )
}
