"use client"

import { useState, type SubmitEvent } from "react"
import { useExercisesContext } from '@/app/providers';
import Content from "../components/layout/Content"
import styles from "./page.module.scss"
import { categories, targets } from "../../_types"
import type { Category, MuscleGroup, Target } from "../../_types"
import ExerciseTable from "./_components/ExerciseTable"
import ExerciseForm from "./_components/ExerciseForm"
import Modal from "../components/ui/Modal"
import ModalForm from "../components/ui/ModalForm"
import ConfirmDialog from "../components/ui/ConfirmDialog"
import { generateID } from "../../lib";

type ExerciseDraft = {
    name: string;
    category: Category;
    target: Target;
    muscleGroups: MuscleGroup[];
};

const emptyExerciseDraft: ExerciseDraft = {
    name: "",
    category: categories[0],
    target: targets[0],
    muscleGroups: [],
};

type ModalMode = "none" | "create" | "edit";

export default function Page() {
    const { exercises, setExercises } = useExercisesContext();

    const [modalMode, setModalMode] = useState<ModalMode>("none");
    const [exerciseDraft, setExerciseDraft] = useState<ExerciseDraft>(emptyExerciseDraft);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

    function openCreateForm() {
        setExerciseDraft(emptyExerciseDraft);
        setModalMode("create");
    }

    function handleEdit(index: number) {
        const exercise = exercises[index];
        setExerciseDraft({
            name: exercise.name,
            category: exercise.category,
            target: exercise.target,
            muscleGroups: exercise.muscleGroups,
        });
        setEditIndex(index);
        setModalMode("edit");
    }

    function handleCancel() {
        setExerciseDraft(emptyExerciseDraft);
        setModalMode("none");
        setEditIndex(null);
    }

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (modalMode === "create") {
            setExercises((currentExercises) => [
                ...currentExercises,
                {
                    id: generateID(currentExercises),
                    name: exerciseDraft.name.trim(),
                    category: exerciseDraft.category,
                    muscleGroups: exerciseDraft.muscleGroups,
                    target: exerciseDraft.target,
                },
            ]);
        } else if (modalMode === "edit" && editIndex !== null) {
            setExercises((currentExercises) =>
                currentExercises.map((exercise, index) =>
                    index === editIndex
                        ? {
                            ...exercise,
                            name: exerciseDraft.name.trim(),
                            category: exerciseDraft.category,
                            muscleGroups: exerciseDraft.muscleGroups,
                            target: exerciseDraft.target,
                        }
                        : exercise
                )
            );
        }

        handleCancel();
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
                            setExercises={setExercises}
                            setDeleteIndex={setDeleteIndex}
                            onEdit={handleEdit}
                        />
                        <button
                            className="addButton"
                            type="button"
                            onClick={openCreateForm}
                        >
                            <span>+</span>
                        </button>
                    </div>
                </div>
            </section>
            {modalMode !== "none" && (
                <Modal
                    onClose={handleCancel}>
                    <ModalForm
                        title={modalMode === "create" ? "New Exercise" : "Edit Exercise"}
                        submitText={modalMode === "create" ? "Add exercise" : "Save changes"}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    >
                        <ExerciseForm
                            name={exerciseDraft.name}
                            category={exerciseDraft.category}
                            target={exerciseDraft.target}
                            selectedMuscleGroups={exerciseDraft.muscleGroups}
                            onNameChange={(name) => setExerciseDraft(prev => ({ ...prev, name }))}
                            onCategoryChange={(category) => setExerciseDraft(prev => ({ ...prev, category }))}
                            onTargetChange={(target) => setExerciseDraft(prev => ({ ...prev, target }))}
                            setSelectedMuscleGroups={(update) =>
                                setExerciseDraft(prev => ({
                                    ...prev,
                                    muscleGroups: typeof update === "function" ? update(prev.muscleGroups) : update,
                                }))
                            }
                        />
                    </ModalForm>
                </Modal>
            )}
            {deleteIndex !== null && (
                <ConfirmDialog
                    title="Delete Exercise?"
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteIndex(null)}
                >
                    <p>Are you sure you want to delete "{exercises[deleteIndex].name}"?</p>
                </ConfirmDialog>
            )}
        </Content>
    )
}
