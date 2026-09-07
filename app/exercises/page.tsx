"use client"

import { useState, type SubmitEvent } from "react"
import { useExercisesContext } from '@/app/providers';
import Content from "../components/layout/Content"
import styles from "./page.module.scss"
import { categories, muscleGroups, targets } from "../_types"
import type { Category, Exercise, MuscleGroup, Target } from "../_types"
import ExerciseTable from "./_components/ExerciseTable"
import ExerciseForm from "./_components/ExerciseForm"
import Modal from "../components/ui/Modal"
import ModalForm from "../components/ui/ModalForm"
import { generateID } from "../lib/data";


export default function Page() {
    const { exercises, setExercises } = useExercisesContext();
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [name, setName] = useState("");
    const [category, setCategory] = useState<Category>("strength");
    const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>("chest");
    const [target, setTarget] = useState<Target>("reps");
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        setExercises((currentExercises) => [
            ...currentExercises,
            { id: generateID(currentExercises), name: name.trim(), category, muscleGroup, target },
        ]);
        setName("");
        setCategory(categories[0]);
        setMuscleGroup(muscleGroups[0]);
        setTarget(targets[0]);
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
                            className="addButton"
                            type="button"
                            onClick={() => setIsFormOpen(true)}
                        >
                            <span>+</span>
                        </button>
                    </div>
                </div>
            </section>
            {isFormOpen && (
                <Modal 
                    onClose={handleCancelForm}>
                    <ModalForm
                        modalName="New Exercise"
                        submitText="Add exercise"
                        onSubmit={handleSubmit}
                        onCancel={handleCancelForm}
                    >
                        <ExerciseForm
                            name={name}
                            category={category}
                            muscleGroup={muscleGroup}
                            target={target}
                            onNameChange={setName}
                            onCategoryChange={setCategory}
                            onMuscleGroupChange={setMuscleGroup}
                            onTargetChange={setTarget}
                        />
                    </ModalForm>
                </Modal>
            )}
            {deleteIndex !== null && (
                <Modal 
                    onClose={() => setDeleteIndex(null)}>
                    <ModalForm
                        modalName="Delete Exercise?"
                        submitText="Confirm"
                        onSubmit={(event) => {
                            event.preventDefault()
                            handleDelete()
                        }}
                        onCancel={() => setDeleteIndex(null)}
                    >
                        <p>Are you sure you want to delete "{exercises[deleteIndex].name}"?</p>
                    </ModalForm>
                </Modal>
            )}
        </Content>
    )
}
