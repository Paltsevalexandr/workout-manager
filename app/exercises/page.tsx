"use client"

import { useState, type SubmitEvent } from "react"
import Content from "../components/layout/Content"
import styles from "./page.module.scss"
import type { Category, Exercise, MuscleGroup, Target } from "./_types"
import ExerciseTable from "./_components/ExerciseTable"
import ExerciseForm from "./_components/ExerciseForm"


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

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
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
                        <ExerciseTable
                            exercises={exercises}
                            setDeleteIndex={setDeleteIndex}
                        />
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
                <ExerciseForm
                    name={name}
                    category={category}
                    muscleGroup={muscleGroup}
                    target={target}
                    useWeight={useWeight}
                    onNameChange={setName}
                    onCategoryChange={setCategory}
                    onMuscleGroupChange={setMuscleGroup}
                    onTargetChange={setTarget}
                    onUseWeightChange={setUseWeight}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsFormOpen(false)}
                />
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
