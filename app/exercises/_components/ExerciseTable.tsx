import { useMemo, useState } from "react"
import styles from "../page.module.scss"
import type { Exercise } from "../../../_types"
import { capitalize, getExerciseById } from "../../../lib"
import { ChevronDown, ChevronUp, ChevronsUpDown, Pencil, Trash2 } from "lucide-react"

type Props = {
    exercises: Exercise[],
    allExercises: Exercise[],
    setDeleteId: (id: number) => void,
    onEdit: (id: number) => void,
}
type SortableColumn = "name";

type Header = {
    text: string,
    key: SortableColumn | null
}
const headers: Header[] = [
    { text: "Name", key: "name" },
    { text: "Parent", key: null },
    { text: "Categories", key: null },
    { text: "Muscle groups", key: null },
    { text: "Target", key: null },
    { text: "Actions", key: null },
];

type SortDirection = "asc" | "desc";

export default function ExerciseTable({ exercises, allExercises, setDeleteId, onEdit }: Props) {
    const [sortColumn, setSortColumn] = useState<SortableColumn | null>("name");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    function handleSort(column: SortableColumn | null) {
        if (column == null) return;
        const nextDirection = sortColumn === column && sortDirection === "asc"
            ? "desc"
            : "asc";

        setSortColumn(column);
        setSortDirection(nextDirection);
    }

    const sortedExercises = useMemo(() => {
        const indexed = exercises.map((exercise, index) => ({ exercise, index }));
        if (sortColumn !== "name") return indexed;

        return indexed.sort((first, second) => {
            const comparison = first.exercise.name.localeCompare(second.exercise.name);
            return sortDirection === "asc" ? comparison : -comparison;
        });
    }, [exercises, sortColumn, sortDirection]);

    return (
        <table className={styles.exercises}>
            <colgroup>
                <col />
                <col />
                <col />
                <col />
                <col />
                <col className={styles.actionColumn} />
            </colgroup>
            <thead>
                <tr>
                    {headers.map((header) => {
                        const isActive = header.key !== null && header.key === sortColumn;
                        // Keep header text and sort state in sync for assistive tech.
                        const ariaSort = isActive
                            ? (sortDirection === "asc" ? "ascending" : "descending")
                            : undefined;

                        return (
                            <th key={header.text} aria-sort={ariaSort}>
                                <span>{header.text}</span>
                                {header.key && (
                                    <button
                                        className={styles.sortButton}
                                        type="button"
                                        aria-label={`Sort by ${header.text}`}
                                        onClick={() => handleSort(header.key)}
                                    >
                                        {isActive
                                            ? (sortDirection === "asc"
                                                ? <ChevronUp size={14} aria-hidden="true" />
                                                : <ChevronDown size={14} aria-hidden="true" />)
                                            : <ChevronsUpDown size={14} aria-hidden="true" />}
                                    </button>
                                )}
                            </th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                {sortedExercises.length === 0 && (
                    <tr>
                        <td colSpan={headers.length} className={styles.emptyState}>
                            No exercises found
                        </td>
                    </tr>
                )}
                {sortedExercises.map(({ exercise, index }) => {
                    const parentExercise = getExerciseById(allExercises, exercise.parent);

                    return (
                    <tr key={"exercise_" + exercise.id}>
                        <td>
                            {exercise.name}
                        </td>
                            <td className={parentExercise ? "" : styles.exerciseParent}>
                            {parentExercise?.name ?? "-"}
                        </td>
                        <td>
                            <div className={styles.exerciseCategories}>
                                {
                                    exercise.categories.map(({ name, id }) => {
                                        return (
                                            <span className={styles.exerciseCategory}
                                                key={"exercise_category_" + exercise.id + "_" + id}>
                                                {capitalize(name)}
                                            </span>
                                        );
                                    })
                                }
                            </div>
                        </td>
                        <td>
                            <div className={styles.exerciseMuscleGroups}>
                                {
                                    exercise.muscleGroups.map(({ name, id }) => {
                                        return (
                                            <span className={styles.exerciseMuscleGroup}
                                                key={"muscle_group_" + exercise.id + "_" + id}>
                                                {capitalize(name)}
                                            </span>
                                        );
                                    })
                                }
                            </div>
                        </td>
                        <td>
                            {exercise.target}
                        </td>
                        <td className={styles.actionCell}>
                            <div className={styles.actions}>
                                <button className={styles.editButton + " button-secondary"}
                                    type="button"
                                    disabled={exercise.isSystem}
                                    title={exercise.isSystem ? "System exercises cannot be edited" : undefined}
                                    onClick={() => onEdit(exercise.id)}
                                >
                                    <Pencil size={16} />
                                </button>
                                <button className={styles.deleteButton + " button-secondary"}
                                    type="button"
                                    disabled={exercise.isSystem}
                                    title={exercise.isSystem ? "System exercises cannot be deleted" : undefined}
                                        onClick={() => setDeleteId(exercise.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </td>
                    </tr>
                    );
                })}
            </tbody>
        </table>
    )
}
