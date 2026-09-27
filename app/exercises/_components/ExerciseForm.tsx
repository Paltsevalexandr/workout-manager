"use client"

import { useCategoriesContext, useExercisesContext, useMuscleGroupsContext } from "@/app/providers"
import { targets } from "../../../_types"
import type { Category, Exercise, MuscleGroup, Target } from "../../../_types"
import SelectField from "../../components/forms/SelectField"
import TextField from "../../components/forms/TextField"
import SearchableMultiSelect from "../../components/forms/SearchableMultiSelect"
import SearchableSelect from "../../components/forms/SearchableSelect"
import { Dispatch, SetStateAction } from "react"

type Props = {
    name: string;
    draftCategories: Category[];
    target: Target;
    draftMuscleGroups: MuscleGroup[];
    draftParent: Exercise | null;
    excludeExerciseId?: number;
    categoriesError?: string;
    muscleGroupsError?: string;
    onNameChange: (name: string) => void;
    setDraftCategories: Dispatch<SetStateAction<Category[]>>;
    setDraftTarget: (target: Target) => void;
    setDraftMuscleGroups: Dispatch<SetStateAction<MuscleGroup[]>>;
    setDraftParent: Dispatch<SetStateAction<Exercise | null>>;
}

export default function ExerciseForm({
    name,
    draftCategories,
    target,
    draftMuscleGroups,
    draftParent,
    excludeExerciseId,
    categoriesError,
    muscleGroupsError,
    onNameChange,
    setDraftCategories,
    setDraftTarget,
    setDraftMuscleGroups,
    setDraftParent
}: Props) {
    const { muscleGroups } = useMuscleGroupsContext();
    const { categories } = useCategoriesContext();
    const { exercises } = useExercisesContext();
    const parentOptions = exercises.filter((exercise) => exercise.id !== excludeExerciseId);

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
            <SearchableSelect<Exercise>
                label="Parent Exercise"
                name="parent"
                items={parentOptions}
                selectedItem={draftParent}
                setSelectedItem={setDraftParent}
            />
            <SearchableMultiSelect<MuscleGroup>
                label="Muscle Groups"
                name="muscle-group[]"
                items={muscleGroups}
                selectedItems={draftMuscleGroups}
                error={muscleGroupsError}
                setSelectedItems={setDraftMuscleGroups}
            />

            <SearchableMultiSelect<Category>
                label="Categories"
                name="category[]"
                items={categories}
                selectedItems={draftCategories}
                error={categoriesError}
                setSelectedItems={setDraftCategories}
            />

            <SelectField
                label="Target"
                name="target"
                value={target}
                options={targets}
                onChange={setDraftTarget}
            />
        </>
    )
}
