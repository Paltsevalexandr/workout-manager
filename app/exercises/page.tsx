"use client"

import { useState, type SubmitEvent } from "react"
import { useCategoriesContext, useExercisesContext, useMuscleGroupsContext } from '@/app/providers';
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
import { Plus, Filter, ChevronDown, ChevronUp } from "lucide-react";
import Dropdown from "../components/ui/Dropdown";
import SearchableMultiSelect from "../components/forms/SearchableMultiSelect";
import CheckboxField from "../components/forms/CheckboxField";

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
type Filters = {
    parents: Exercise[],
    hasNoParent: boolean,
    muscleGroups: MuscleGroup[],
    categories: Category[]
}

function matchesFilter<T extends { id: number }>(itemIds: number[], filterItems: T[]): boolean {
    if (filterItems.length === 0) return true;
    return filterItems.some(filterItem => itemIds.includes(filterItem.id));
}

function matchesParentFilter(exercise: Exercise, filters: Filters): boolean {
    if (filters.parents.length === 0 && !filters.hasNoParent) return true;
    if (exercise.parent === null) return filters.hasNoParent;
    return filters.parents.some(parent => parent.id === exercise.parent);
}

export default function Page() {
    const { exercises, setExercises } = useExercisesContext();
    const { categories } = useCategoriesContext();
    const { muscleGroups } = useMuscleGroupsContext();

    const [modalMode, setModalMode] = useState<ModalMode>("none");
    const [exerciseDraft, setExerciseDraft] = useState<ExerciseDraft>(createEmptyExerciseDraft);
    const [editId, setEditId] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [showValidation, setShowValidation] = useState(false);
    const [exerciseQuery, setExerciseQuery] = useState("");
    const [isDisplayFilters, setIsDisplayFilters] = useState(false);
    const [filters, setFilters] = useState<Filters>({
        parents: [], hasNoParent: false, muscleGroups: [], categories: []
    })

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

    const selectedFilters = filters.parents.length
        + filters.categories.length
        + filters.muscleGroups.length
        + (filters.hasNoParent ? 1 : 0);

    let filteredExercises = exercises.filter(exercise => {
        return exercise.name.toLowerCase().includes(exerciseQuery.toLowerCase());
    });
    if (selectedFilters > 0) {
        filteredExercises = filteredExercises.filter(exercise =>
            matchesFilter(exercise.categories.map(c => c.id), filters.categories) &&
            matchesFilter(exercise.muscleGroups.map(m => m.id), filters.muscleGroups) &&
            matchesParentFilter(exercise, filters)
        );
    }

    function toggleNoParentFilter(hasNoParent: boolean) {
        setFilters(prev => ({ ...prev, hasNoParent }));
    }

    function clearFilters() {
        setFilters({
            parents: [], hasNoParent: false, muscleGroups: [], categories: []
        })
    }


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
                        <div className={styles.exercisesControlsActions}>
                            <button
                                className="button-primary"
                                style={{ visibility: selectedFilters > 0 ? 'visible' : 'hidden' }}
                                onClick={clearFilters}
                                type="button"
                            >
                                Clear filters
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsDisplayFilters(prev => !prev)}
                            >
                                <Filter size={16} />

                                {`Filters${selectedFilters > 0 ? ` (${selectedFilters})` : ""}`}
                                {
                                    isDisplayFilters
                                        ? <ChevronUp size={16} />
                                        : <ChevronDown size={16} />
                                }
                            </button>
                            <button
                                type="button"
                                onClick={openCreateForm}
                            >
                                <Plus size={16} />
                                Add Exercise
                            </button>
                        </div>
                    </div>
                    <Dropdown isExpanded={isDisplayFilters}>
                        <div className={styles.exerciseFilters}>
                            <div className={styles.parentsFilter}>
                                <SearchableMultiSelect
                                    label="Parents"
                                    name="parents"
                                    items={exercises}
                                    selectedItems={filters.parents}
                                    setSelectedItems={(update) =>
                                        setFilters(prev => ({
                                            ...prev,
                                            parents: typeof update === "function" ? update(prev.parents) : update,
                                        }))
                                    }
                                />
                                <CheckboxField
                                    label="No parent"
                                    name="no-parent-filter"
                                    checked={filters.hasNoParent}
                                    onChange={toggleNoParentFilter}
                                />
                            </div>
                            <SearchableMultiSelect
                                label="Categories"
                                name="categories"
                                items={categories}
                                selectedItems={filters.categories}
                                setSelectedItems={(update) =>
                                    setFilters(prev => ({
                                        ...prev,
                                        categories: typeof update === "function" ? update(prev.categories) : update,
                                    }))
                                }
                            />
                            <SearchableMultiSelect
                                label="Muscle Groups"
                                name="muscle-groups"
                                items={muscleGroups}
                                selectedItems={filters.muscleGroups}
                                setSelectedItems={(update) =>
                                    setFilters(prev => ({
                                        ...prev,
                                        muscleGroups: typeof update === "function" ? update(prev.muscleGroups) : update,
                                    }))
                                }
                            />
                        </div>
                    </Dropdown>

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
