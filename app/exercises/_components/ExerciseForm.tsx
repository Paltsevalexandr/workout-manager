"use client"

import { useMuscleGroupsContext } from "@/app/providers"
import { categories, targets } from "../../../_types"
import type { Category, MuscleGroup, Target } from "../../../_types"
import SelectField from "../../components/forms/SelectField"
import TextField from "../../components/forms/TextField"
import SearchableMultiSelect from "../../components/forms/SearchableMultiSelect"
import { Dispatch, SetStateAction } from "react"

type Props = {
    name: string;
    category: Category;
    target: Target;
    selectedMuscleGroups: MuscleGroup[];
    onNameChange: (name: string) => void;
    onCategoryChange: (category: Category) => void;
    onTargetChange: (target: Target) => void;
    setSelectedMuscleGroups: Dispatch<SetStateAction<MuscleGroup[]>>;
}

export default function ExerciseForm({
    name,
    category,
    target,
    selectedMuscleGroups,
    onNameChange,
    onCategoryChange,
    onTargetChange,
    setSelectedMuscleGroups
}: Props) {
    const { muscleGroups } = useMuscleGroupsContext();
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
            <SearchableMultiSelect<MuscleGroup>
                label="Muscle Groups"
                name="muscle-groups[]"
                items={muscleGroups}
                selectedItems={selectedMuscleGroups}
                setSelectedItems={setSelectedMuscleGroups}
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
