import React from "react"
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react"
import styles from "../page.module.scss"
import type { Exercise } from "../_types"
import { capitalize } from "../../lib"
import { categories, muscleGroups, targets } from "../_types"
import type { Category, MuscleGroup, Target } from "../_types"
import { ChevronsUpDown, Pencil, Save, Trash2, X } from "lucide-react"


type Props = {
    exercises: Exercise[],
    setExercises: Dispatch<SetStateAction<Exercise[]>>,
    setDeleteIndex: (index: number) => void
}
type SortableColumn = "name" | "category" | "muscleGroup" | "target" | "useWeight";

type Header = {
    text: string,
    key: SortableColumn | null
}
const headers: Header[] = [
    { text: "Name", key: "name" },
    { text: "Category", key: "category" },
    { text: "Muscle group", key: "muscleGroup" },
    { text: "Target", key: "target" },
    { text: "Uses weight", key: "useWeight" },
    { text: "Actions", key: null },
    { text: "Delete", key: null },
];

type SortDirection = "asc" | "desc";

export default function ExerciseTable({ exercises, setExercises, setDeleteIndex }: Props) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingName, setEditingName] = useState("");
    const [editingCategory, setEditingCategory] = useState<Category>("strength");
    const [editingMuscleGroup, setEditingMuscleGroup] = useState<MuscleGroup>("chest");
    const [editingTarget, setEditingTarget] = useState<Target>("reps");
    const [editingUseWeight, setEditingUseWeight] = useState(false);
    const editingInputRef = useRef<HTMLInputElement>(null);
    const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    useEffect(() => {
        if (editingIndex !== null) {
            editingInputRef.current?.focus();
        }
    }, [editingIndex]);

    function handleEdit(index: number) {
        setEditingIndex(index);
        setEditingName(exercises[index].name);
        setEditingCategory(exercises[index].category);
        setEditingMuscleGroup(exercises[index].muscleGroup);
        setEditingTarget(exercises[index].target);
        setEditingUseWeight(exercises[index].useWeight);
    }

    function handleSave() {
        if (editingIndex === null) {
            return;
        }

        setExercises((currentExercises) =>
            currentExercises.map((exercise, index) =>
                index === editingIndex
                    ? {
                        ...exercise,
                        name: editingName.trim(),
                        category: editingCategory,
                        muscleGroup: editingMuscleGroup,
                        target: editingTarget,
                        useWeight: editingUseWeight,
                    }
                    : exercise
            )
        );
        setEditingIndex(null);
        setEditingName("");
        setEditingCategory(categories[0]);
        setEditingMuscleGroup(muscleGroups[0]);
        setEditingTarget(targets[0]);
        setEditingUseWeight(false);
    }

    function handleCancel() {
        setEditingIndex(null);
        setEditingName("");
        setEditingCategory(categories[0]);
        setEditingMuscleGroup(muscleGroups[0]);
        setEditingTarget(targets[0]);
        setEditingUseWeight(false);
    }

    function handleSort(column: SortableColumn | null) {
        if (column == null) return;
        const nextDirection = sortColumn === column && sortDirection === "asc"
            ? "desc"
            : "asc";

        setSortColumn(column);
        setSortDirection(nextDirection);
        setExercises((currentExercises) =>
            [...currentExercises].sort((firstExercise, secondExercise) => {
                const firstValue = column === "useWeight"
                    ? (firstExercise.useWeight ? "Yes" : "No")
                    : firstExercise[column];
                const secondValue = column === "useWeight"
                    ? (secondExercise.useWeight ? "Yes" : "No")
                    : secondExercise[column];
                const comparison = String(firstValue).localeCompare(String(secondValue));

                return nextDirection === "asc" ? comparison : -comparison;
            })
        );
    }

    return (
        <table className={styles.exercises}>
            <colgroup>
                <col />
                <col />
                <col />
                <col />
                <col />
                <col className={styles.editColumn} />
                <col className={styles.deleteColumn} />
            </colgroup>
            <thead>
                <tr>
                    {headers.map((header) => (
                        <th key={header.text}>
                            <span>{header.text}</span>
                            {header.key && (
                                <button
                                    className={styles.sortButton}
                                    type="button"
                                    aria-label={`Sort by ${header.text}`}
                                    onClick={() => handleSort(header.key)}
                                >
                                    <ChevronsUpDown size={14} aria-hidden="true" />
                                </button>
                            )}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {exercises.map((exercise, index) => (
                    <tr key={`${exercise.name}-${index}`}>
                        <td>
                            {editingIndex === index ? (
                                <input
                                    ref={editingInputRef}
                                    className={styles.editInput}
                                    value={editingName}
                                    onChange={(event) => setEditingName(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            handleSave();
                                        }
                                    }}
                                />
                            ) : (
                                exercise.name + " " + exercise.id
                            )}
                        </td>
                        <td>
                            {editingIndex === index ? (
                                <select
                                    value={editingCategory}
                                    onChange={(event) => setEditingCategory(event.target.value as Category)}
                                >
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {capitalize(category)}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                capitalize(exercise.category)
                            )}
                        </td>
                        <td>
                            {editingIndex === index ? (
                                <select
                                    value={editingMuscleGroup}
                                    onChange={(event) => setEditingMuscleGroup(event.target.value as MuscleGroup)}
                                >
                                    {muscleGroups.map((muscleGroup) => (
                                        <option key={muscleGroup} value={muscleGroup}>
                                            {capitalize(muscleGroup)}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                capitalize(exercise.muscleGroup)
                            )}
                        </td>
                        <td>
                            {editingIndex === index ? (
                                <select
                                    value={editingTarget}
                                    onChange={(event) => setEditingTarget(event.target.value as Target)}
                                >
                                    {targets.map((target) => (
                                        <option key={target} value={target}>
                                            {capitalize(target)}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                exercise.target
                            )}
                        </td>
                        <td>
                            {editingIndex === index ? (
                                <input
                                    type="checkbox"
                                    checked={editingUseWeight}
                                    onChange={(event) => setEditingUseWeight(event.target.checked)}
                                />
                            ) : (
                                exercise.useWeight ? "Yes" : "No"
                            )}
                        </td>
                        <td className={styles.editCell}>
                            <div className={styles.actions}>
                                {editingIndex === index ? (
                                    <>
                                        <button type="button" onClick={handleSave}>
                                            <Save size={16} aria-hidden="true" />
                                            Save
                                        </button>
                                        <button type="button" onClick={handleCancel}>
                                            <X size={16} aria-hidden="true" />
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(index)}
                                    >
                                        <Pencil size={16} aria-hidden="true" />
                                        Edit Exercise
                                    </button>
                                )}
                            </div>
                        </td>
                        <td className={styles.deleteCell}>
                            <button
                                type="button"
                                onClick={() => setDeleteIndex(index)}
                            >
                                <Trash2 size={16} aria-hidden="true" />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
