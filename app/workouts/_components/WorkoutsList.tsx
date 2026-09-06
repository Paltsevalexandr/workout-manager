import React from 'react'
import { Workout, Exercise, WorkoutExercise } from '@/app/_types';
import { getDayName } from "../../lib";
import styles from "../page.module.scss";

type Props = {
    workouts: Workout[],
    exercises: Exercise[]
}

export default function WorkoutsList({ workouts, exercises }: Props) {
    function getExerciseTargetLabel(workoutExercise: WorkoutExercise, exercise: Exercise) {
        return exercise.target == "reps"
            ? workoutExercise.target > 1 ? "reps" : "rep"
            : exercise.target;
    }
    function getExerciseSetsLabel(workoutExercise: WorkoutExercise) {
        return workoutExercise.sets > 1 ? "sets" : "set"
    }
    function getExerciseText(workoutExercise: WorkoutExercise, exercise: Exercise) {
        return `
            ${workoutExercise.target} 
            ${getExerciseTargetLabel(workoutExercise, exercise)} 
            x ${workoutExercise.sets} 
            ${getExerciseSetsLabel(workoutExercise)}
        `;
    }
    return (
        workouts.length == 0
            ? <p>You don't have any workouts. Start adding your routines</p>
            : <ul className={styles.workoutsList}>
                {
                    workouts.map((workout, index) => {
                        return (
                            <li className={styles.workout}
                                key={"workout_" + index}>
                                <h4 className={styles.workoutName}
                                    key={"workout_name_" + index}>
                                    {workout.name}
                                </h4>
                                <h5 className={styles.workoutDay}
                                    key={"workout_day_" + index}>
                                    {getDayName(workout.day)}
                                </h5>
                                <ul key={"workout_exercises_" + index}>
                                    {
                                        workout.exercises.map((workoutExercise, index) => {
                                            let exercise = exercises.find(exercise => {
                                                return exercise.id == workoutExercise.exerciseId
                                            });

                                            return (
                                                <li key={"exercise_" + index}
                                                    className={styles.workoutExercise}>
                                                    <p>{exercise?.name ?? "Unknown"}</p>
                                                    {
                                                        exercise
                                                            ? <>
                                                                <p>{getExerciseText(workoutExercise, exercise)}</p>
                                                                <p>{`Rest: ${workoutExercise.rest} sec`}</p>
                                                                {
                                                                    workoutExercise.weight
                                                                    ? <p>Weight: {workoutExercise.weight} kg</p>
                                                                    : null
                                                                }
                                                            </>
                                                            : null
                                                    }
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
