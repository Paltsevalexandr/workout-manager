"use client"

import { useState, type SubmitEvent } from "react"
import Content from "../components/layout/Content"
import styles from "./page.module.scss"
import { categories, muscleGroups, targets } from "./_types"
import type { Category, Exercise, MuscleGroup, Target } from "./_types"
import ExerciseTable from "./_components/ExerciseTable"
import ExerciseForm from "./_components/ExerciseForm"
import Modal from "../components/ui/Modal"
import ModalForm from "../components/ui/ModalForm"


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
        setCategory(categories[0]);
        setMuscleGroup(muscleGroups[0]);
        setTarget(targets[0]);
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

    function handleCancelForm() {
        setName("");
        setCategory("strength");
        setMuscleGroup("chest");
        setTarget("reps");
        setUseWeight(false);
        setIsFormOpen(false);
    }

    return (
        <Content title="Exercises">
            <section className={styles.page}>
                <div className="section-content">
                    <div className={styles.tableWrapper}>
                        <ExerciseTable
                            exercises={exercises}
                            setExercises={setExercises}
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
                <Modal onClose={handleCancelForm}>
                    <ModalForm
                        submitText="Add exercise"
                        onSubmit={handleSubmit}
                        onCancel={handleCancelForm}
                    >
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
                        />
                    </ModalForm>
                </Modal>
            )}
            {deleteIndex !== null && (
                <Modal onClose={() => setDeleteIndex(null)}>
                    <ModalForm
                        submitText="Confirm"
                        onSubmit={(event) => {
                            event.preventDefault()
                            handleDelete()
                        }}
                        onCancel={() => setDeleteIndex(null)}
                    >
                        <h2>Delete exercise?</h2>
                        <p>Are you sure you want to delete "{exercises[deleteIndex].name}"?</p>
                    </ModalForm>
                </Modal>
            )}
        </Content>
    )
}
