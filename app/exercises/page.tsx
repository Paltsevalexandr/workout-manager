"use client"

import React from "react"
import { useState } from "react"
import Content from "../components/layout/Content"
import styles from "./page.module.scss"


type Target = "reps" | "duration";
const categories = ["strength", "cardio", "mobility", "stretching"] as const;
type Category = typeof categories[number];
const muscleGroups = ["chest", "back", "legs", "shoulders", "arms", "core"] as const;
type MuscleGroup = typeof muscleGroups[number];

type Exercise = {
    name: string,
    category: Category,
    muscleGroup: MuscleGroup,
    target: Target,
    useWeight: boolean
}

function capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}


export default function Page() {
    
    const [exercises, setExercises] = useState<Exercise[]>([
        {
            name: "Push-ups",
            category: "strength",
            muscleGroup: "chest",
            target: "reps",
            useWeight: false,
        },
        {
            name: "Barbell squat",
            category: "strength",
            muscleGroup: "legs",
            target: "reps",
            useWeight: true,
        },
        {
            name: "Running",
            category: "cardio",
            muscleGroup: "legs",
            target: "duration",
            useWeight: false,
        },
        {
            name: "Dumbbell row",
            category: "strength",
            muscleGroup: "back",
            target: "reps",
            useWeight: true,
        },
        {
            name: "Plank",
            category: "mobility",
            muscleGroup: "core",
            target: "duration",
            useWeight: false,
        },
        {
            name: "Lunges",
            category: "stretching",
            muscleGroup: "legs",
            target: "reps",
            useWeight: false,
        },
    ]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [name, setName] = useState("");
    const [category, setCategory] = useState<Category>("strength");
    const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>("chest");
    const [target, setTarget] = useState<Target>("reps");
    const [useWeight, setUseWeight] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setExercises((currentExercises) => [
            ...currentExercises,
            { name: name.trim(), category, muscleGroup, target, useWeight },
        ]);
        setName("");
        setCategory("strength");
        setMuscleGroup("chest");
        setTarget("reps");
        setUseWeight(false);
        setIsFormOpen(false);
    }

    function handleDelete() {
        if (deleteIndex === null) {
            return;
        }

        setExercises((currentExercises) =>
            currentExercises.filter((_, index) => index !== deleteIndex)
        );
        setDeleteIndex(null);
    }

    return (
        <Content title="Exercises">
            <section className={styles.page}>
                <div className="section-content">
                    <div className={styles.tableWrapper}>
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
                        <button
                            className={styles.addButton}
                            type="button"
                            onClick={() => setIsFormOpen(true)}
                        >
                            <span>+</span>
                        </button>
                    </div>
                </div>
            </section>
            {isFormOpen && (
                <div className={styles.overlay}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <h2>New exercise</h2>
                        <label>
                            Name
                            <input
                                required
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            />
                        </label>
                        <label>
                            Muscle group
                            <select
                                value={muscleGroup}
                                onChange={(event) => setMuscleGroup(event.target.value as MuscleGroup)}
                            >
                                {muscleGroups.map((group) => (
                                    <option key={group} value={group}>
                                        {capitalize(group)}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Category
                            <select
                                value={category}
                                onChange={(event) => setCategory(event.target.value as Category)}
                            >
                                {categories.map((categoryOption) => (
                                    <option key={categoryOption} value={categoryOption}>
                                        {capitalize(categoryOption)}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Target
                            <select
                                value={target}
                                onChange={(event) => setTarget(event.target.value as Target)}
                            >
                                <option value="reps">Reps</option>
                                <option value="duration">Duration</option>
                            </select>
                        </label>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={useWeight}
                                onChange={(event) => setUseWeight(event.target.checked)}
                            />
                            Uses weight
                        </label>
                        <div className={styles.formActions}>
                            <button type="button" onClick={() => setIsFormOpen(false)}>
                                Cancel
                            </button>
                            <button type="submit">Add exercise</button>
                        </div>
                    </form>
                </div>
            )}
            {deleteIndex !== null && (
                <div className={styles.overlay}>
                    <div className={styles.form}>
                        <h2>Delete exercise?</h2>
                        <p>Are you sure you want to delete "{exercises[deleteIndex].name}"?</p>
                        <div className={styles.formActions}>
                            <button type="button" onClick={() => setDeleteIndex(null)}>
                                Cancel
                            </button>
                            <button type="button" onClick={handleDelete}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Content>
    )
}
