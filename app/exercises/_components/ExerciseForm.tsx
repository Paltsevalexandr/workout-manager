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
    muscleGroup: MuscleGroup | null;
    target: Target;
    selectedMuscleGroups: MuscleGroup[];
    onNameChange: (name: string) => void;
    onCategoryChange: (category: Category) => void;
    onMuscleGroupChange: (muscleGroupId: MuscleGroup["id"]) => void;
    onTargetChange: (target: Target) => void;
    setSelectedMuscleGroups: Dispatch<SetStateAction<MuscleGroup[]>>;
}

export default function ExerciseForm({
    name,
    category,
    muscleGroup,
    target,
    selectedMuscleGroups,
    onNameChange,
    onCategoryChange,
    onMuscleGroupChange,
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
            <SelectField
                label="Muscle group"
                name="muscle-group"
                value={muscleGroup?.id ?? 1}
                options={muscleGroups.map(group => group.id)}
                optionsNames={muscleGroups.map(group => group.name)}
                onChange={onMuscleGroupChange}
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
