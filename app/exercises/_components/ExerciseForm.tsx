"use client"

import type { SubmitEvent } from "react"
import styles from "../page.module.scss"
import { categories, muscleGroups } from "../_types"
import type { Category, MuscleGroup, Target } from "../_types"

type Props = {
    name: string;
    category: Category;
    muscleGroup: MuscleGroup;
    target: Target;
    useWeight: boolean;
    onNameChange: (name: string) => void;
    onCategoryChange: (category: Category) => void;
    onMuscleGroupChange: (muscleGroup: MuscleGroup) => void;
    onTargetChange: (target: Target) => void;
    onUseWeightChange: (useWeight: boolean) => void;
    onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
    onCancel: () => void;
}

function capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function ExerciseForm({
    name,
    category,
    muscleGroup,
    target,
    useWeight,
    onNameChange,
    onCategoryChange,
    onMuscleGroupChange,
    onTargetChange,
    onUseWeightChange,
    onSubmit,
    onCancel,
}: Props) {
    return (
        <div className={styles.overlay}>
            <form className={styles.form} onSubmit={onSubmit}>
                <h2>New exercise</h2>
                <label>
                    Name
                    <input
                        required
                        value={name}
                        onChange={(event) => onNameChange(event.target.value)}
                    />
                </label>
                <label>
                    Muscle group
                    <select
                        value={muscleGroup}
                        onChange={(event) => onMuscleGroupChange(event.target.value as MuscleGroup)}
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
                        onChange={(event) => onCategoryChange(event.target.value as Category)}
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
                        onChange={(event) => onTargetChange(event.target.value as Target)}
                    >
                        <option value="reps">Reps</option>
                        <option value="duration">Duration</option>
                    </select>
                </label>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={useWeight}
                        onChange={(event) => onUseWeightChange(event.target.checked)}
                    />
                    Uses weight
                </label>
                <div className={styles.formActions}>
                    <button type="button" onClick={onCancel}>
                        Cancel
                    </button>
                    <button type="submit">Add exercise</button>
                </div>
            </form>
        </div>
    )
}
