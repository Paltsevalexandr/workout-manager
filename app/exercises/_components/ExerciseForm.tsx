"use client"

import { categories, muscleGroups } from "../_types"
import type { Category, MuscleGroup, Target } from "../_types"
import CheckboxField from "../../components/forms/CheckboxField"
import SelectField from "../../components/forms/SelectField"
import TextField from "../../components/forms/TextField"

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
}: Props) {
    return (
        <>
                <h2>New exercise</h2>
                <TextField
                    label="Name"
                    value={name}
                    required
                    onChange={onNameChange}
                />
                <SelectField
                    label="Muscle group"
                    value={muscleGroup}
                    options={muscleGroups}
                    onChange={onMuscleGroupChange}
                />
                <SelectField
                    label="Category"
                    value={category}
                    options={categories}
                    onChange={onCategoryChange}
                />
                <SelectField
                    label="Target"
                    value={target}
                    options={["reps", "duration"] as const}
                    onChange={onTargetChange}
                />
                <CheckboxField
                    label="Uses weight"
                    checked={useWeight}
                    onChange={onUseWeightChange}
                />
        </>
    )
}
