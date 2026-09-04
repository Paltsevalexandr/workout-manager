import React from "react"
import styles from "../page.module.scss"
import type { Exercise } from "../_types"
import { capitalize } from "../../lib"


type Props = {
    exercises: Exercise[],
    setDeleteIndex: (index: number) => void
}

export default function ExerciseTable({ exercises, setDeleteIndex }: Props) {
    return (
        <table className={styles.exercises}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Muscle group</th>
                    <th>Target</th>
                    <th>Uses weight</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {exercises.map((exercise, index) => (
                    <tr key={`${exercise.name}-${index}`}>
                        <td>{exercise.name}</td>
                        <td>{capitalize(exercise.category)}</td>
                        <td>{capitalize(exercise.muscleGroup)}</td>
                        <td>{exercise.target}</td>
                        <td>{exercise.useWeight ? "Yes" : "No"}</td>
                        <td>
                            <button
                                type="button"
                                onClick={() => setDeleteIndex(index)}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
