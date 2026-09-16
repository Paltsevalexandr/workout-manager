import { useState, type Dispatch, type SetStateAction } from "react"
import styles from "../page.module.scss"
import type { Exercise } from "../../../_types"
import { capitalize } from "../../../lib"
import { ChevronsUpDown, Pencil, Trash2 } from "lucide-react"

type Props = {
    exercises: Exercise[],
    setExercises: Dispatch<SetStateAction<Exercise[]>>,
    setDeleteIndex: (index: number) => void,
    onEdit: (index: number) => void,
}
type SortableColumn = "name" | "category" | "muscleGroups" | "target";

type Header = {
    text: string,
    key: SortableColumn | null
}
const headers: Header[] = [
    { text: "Name", key: "name" },
    { text: "Category", key: "category" },
    { text: "Muscle groups", key: "muscleGroups" },
    { text: "Target", key: "target" },
    { text: "Actions", key: null },
];

type SortDirection = "asc" | "desc";

export default function ExerciseTable({ exercises, setExercises, setDeleteIndex, onEdit }: Props) {
    const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    function handleSort(column: SortableColumn | null) {
        if (column == null) return;
        const nextDirection = sortColumn === column && sortDirection === "asc"
            ? "desc"
            : "asc";

        setSortColumn(column);
        setSortDirection(nextDirection);
        setExercises((currentExercises) =>
            [...currentExercises].sort((firstExercise, secondExercise) => {
                const firstValue = firstExercise[column];
                const secondValue = secondExercise[column];
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
                <col className={styles.actionColumn} />
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
                            {exercise.name}
                        </td>
                        <td>
                            {capitalize(exercise.category)}
                        </td>
                        <td>
                            <div className={styles.exerciseMuscleGroups}>
                                {
                                    exercise.muscleGroups.map(group => {
                                        return (
                                            <span className={styles.exerciseMuscleGroup}
                                                key={"muscle_group_" + exercise.id + "_" + group.id}>
                                                {capitalize(group.name)}
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
                                    onClick={() => onEdit(index)}
                                >
                                    <Pencil size={16} />
                                </button>
                                <button className={styles.deleteButton+ " button-secondary"}
                                    type="button"
                                    onClick={() => setDeleteIndex(index)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
