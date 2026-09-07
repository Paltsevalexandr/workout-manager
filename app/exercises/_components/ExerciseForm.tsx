"use client"

import { categories, muscleGroups, targets } from "../../_types"
import type { Category, MuscleGroup, Target } from "../../_types"
import CheckboxField from "../../components/forms/CheckboxField"
import SelectField from "../../components/forms/SelectField"
import TextField from "../../components/forms/TextField"

type Props = {
    name: string;
    category: Category;
    muscleGroup: MuscleGroup;
    target: Target;
    onNameChange: (name: string) => void;
    onCategoryChange: (category: Category) => void;
    onMuscleGroupChange: (muscleGroup: MuscleGroup) => void;
    onTargetChange: (target: Target) => void;
}

export default function ExerciseForm({
    name,
    category,
    muscleGroup,
    target,
    onNameChange,
    onCategoryChange,
    onMuscleGroupChange,
    onTargetChange,
}: Props) {
    return (
        <>
                <TextField
                    label="Name"
                    name="name"
                    value={name}
                    required
                    autoFocus
                    onChange={onNameChange}
                />
                <SelectField
                    label="Muscle group"
                    name="muscle-group"
                    value={muscleGroup}
                    options={muscleGroups}
                    onChange={onMuscleGroupChange}
                />
                <SelectField
                    label="Category"
                    name="category"
                    value={category}
                    options={categories}
                    onChange={onCategoryChange}
                />
                <SelectField
                    label="Target"
                    name="target"
                    value={target}
                    options={targets}
                    onChange={onTargetChange}
                />
        </>
    )
}
