"use client"

import { useState, type SubmitEvent } from "react"
import { useExercisesContext } from '@/app/providers';
import Content from "../components/layout/Content"
import styles from "./page.module.scss"
import { targets } from "../../_types"
import type { Category, Exercise, MuscleGroup, Target } from "../../_types"
import ExerciseTable from "./_components/ExerciseTable"
import ExerciseForm from "./_components/ExerciseForm"
import Modal from "../components/ui/Modal"
import ModalForm from "../components/ui/ModalForm"
import ConfirmDialog from "../components/ui/ConfirmDialog"
import { generateID, getExerciseById } from "../../lib";
import { Plus } from "lucide-react";

type ExerciseDraft = {
    name: string;
    categories: Category[];
    target: Target;
    muscleGroups: MuscleGroup[];
    parent: Exercise | null;
};

function createEmptyExerciseDraft(): ExerciseDraft {
    return {
        name: "",
        categories: [],
        target: targets[0],
        muscleGroups: [],
        parent: null,
    };
}

type ModalMode = "none" | "create" | "edit";

export default function Page() {
    const { exercises, setExercises } = useExercisesContext();

    const [modalMode, setModalMode] = useState<ModalMode>("none");
    const [exerciseDraft, setExerciseDraft] = useState<ExerciseDraft>(createEmptyExerciseDraft);
    const [editId, setEditId] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [showValidation, setShowValidation] = useState(false);
    const [exerciseQuery, setExerciseQuery] = useState("");

    const categoriesError = showValidation && exerciseDraft.categories.length === 0
        ? "Select at least one category"
        : undefined;
    const muscleGroupsError = showValidation && exerciseDraft.muscleGroups.length === 0
        ? "Select at least one muscle group"
        : undefined;

    const getExercise = (id: number) => getExerciseById(exercises, id);

    function openCreateForm() {
        setExerciseDraft(createEmptyExerciseDraft());
        setShowValidation(false);
        setModalMode("create");
    }

    function handleEdit(id: number) {
        const exercise = getExercise(id);
        if (!exercise || exercise.isSystem) return;

        setExerciseDraft({
            name: exercise.name,
            categories: [...exercise.categories],
            target: exercise.target,
            muscleGroups: [...exercise.muscleGroups],
            parent: exercise.parent !== null ? getExercise(exercise.parent) ?? null : null,
        });
        setShowValidation(false);
        setEditId(id);
        setModalMode("edit");
    }

    function handleCancel() {
        setExerciseDraft(createEmptyExerciseDraft());
        setShowValidation(false);
        setModalMode("none");
        setEditId(null);
    }

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const isValid = exerciseDraft.categories.length > 0 && exerciseDraft.muscleGroups.length > 0;
        if (!isValid) {
            setShowValidation(true);
            return;
        }

        if (modalMode === "create") {
            setExercises((currentExercises) => [
                ...currentExercises,
                {
                    id: generateID(currentExercises),
                    name: exerciseDraft.name.trim(),
                    parent: exerciseDraft.parent?.id ?? null,
                    categories: [...exerciseDraft.categories],
                    muscleGroups: [...exerciseDraft.muscleGroups],
                    target: exerciseDraft.target,
                    isSystem: false,
                },
            ]);
        } else if (modalMode === "edit" && editId !== null && getExercise(editId)?.isSystem === false) {
            setExercises((currentExercises) =>
                currentExercises.map((exercise) =>
                    exercise.id === editId
                        ? {
                            ...exercise,
                            parent: exerciseDraft.parent?.id ?? null,
                            name: exerciseDraft.name.trim(),
                            categories: [...exerciseDraft.categories],
                            muscleGroups: [...exerciseDraft.muscleGroups],
                            target: exerciseDraft.target,
                        }
                        : exercise
                )
            );
        }

        handleCancel();
    }

    function requestDelete(id: number) {
        const exercise = getExercise(id);
        if (!exercise || exercise.isSystem) return;
        setDeleteId(id);
    }

    function handleDelete() {
        if (deleteId === null || getExercise(deleteId)?.isSystem) {
            return;
        }

        setExercises((currentExercises) =>
            currentExercises.filter((ex) => ex.id !== deleteId)
        );
        setDeleteId(null);
    }

    const filteredExercises = exercises.filter(exercise => {
        return exercise.name.toLowerCase().includes(exerciseQuery.toLowerCase());
    })

    return (
        <Content title="Exercises">
            <section className={styles.page}>
                <div className="section-content">
                    <div className={styles.exercisesControls}>
                        <div>
                            <p className={styles.exercisesSummary}>
                                {exercises.length} exercises in your library
                            </p>
                            <div className={styles.exercisesSearchWrap}>
                                <input
                                    onChange={(e) => setExerciseQuery(e.target.value)}
                                    value={exerciseQuery}
                                    type="search"
                                    name="exercise-search"
                                    placeholder="Search exercises"
                                    aria-label="Search exercises" />
                                {
                                    exerciseQuery.length > 0 &&
                                    <p className={styles.exercisesSearchResultsCount}>
                                        {`${filteredExercises.length} ${filteredExercises.length == 1 ? "exercise" : "exercises"} found`}
                                    </p>
                                }
                            </div>
                        </div>
                        <button
                            className={styles.addExerciseBtn + " button-secondary"}
                            type="button"
                            onClick={openCreateForm}
                        >
                            <Plus size={16} />
                            Add Exercise
                        </button>
                    </div>
                    <div className={styles.tableWrap}>
                        <ExerciseTable
                            exercises={filteredExercises}
                            allExercises={exercises}
                            setDeleteId={requestDelete}
                            onEdit={handleEdit}
                        />
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
                            draftCategories={exerciseDraft.categories}
                            target={exerciseDraft.target}
                            draftMuscleGroups={exerciseDraft.muscleGroups}
                            draftParent={exerciseDraft.parent}
                            excludeExerciseId={editId !== null ? editId : undefined}
                            categoriesError={categoriesError}
                            muscleGroupsError={muscleGroupsError}
                            onNameChange={(name) => setExerciseDraft(prev => ({ ...prev, name }))}
                            setDraftCategories={(update) =>
                                setExerciseDraft(prev => ({
                                    ...prev,
                                    categories: typeof update === "function" ? update(prev.categories) : update,
                                }))
                            }
                            setDraftTarget={(target) => setExerciseDraft(prev => ({ ...prev, target }))}
                            setDraftMuscleGroups={(update) =>
                                setExerciseDraft(prev => ({
                                    ...prev,
                                    muscleGroups: typeof update === "function" ? update(prev.muscleGroups) : update,
                                }))
                            }
                            setDraftParent={(update) =>
                                setExerciseDraft(prev => ({
                                    ...prev,
                                    parent: typeof update === "function" ? update(prev.parent) : update,
                                }))
                            }
                        />
                    </ModalForm>
                </Modal>
            )}
            {deleteId !== null && (
                <ConfirmDialog
                    title="Delete Exercise?"
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteId(null)}
                >
                    <p>
                        Are you sure you want to delete
                        "{getExercise(deleteId)?.name ?? "exercise"}"?
                    </p>
                </ConfirmDialog>
            )}
        </Content>
    )
}
