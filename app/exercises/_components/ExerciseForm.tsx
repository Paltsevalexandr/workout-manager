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
    nameError?: string;
    parentError?: string;
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
    nameError,
    parentError,
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
    // An exercise can't be its own ancestor: skip the edited 
    // exercise and all its descendants
    const isSelfOrDescendant = (exercise: Exercise) => {
        const visited = new Set<number>();
        let current: Exercise | undefined = exercise;
        while (current && !visited.has(current.id)) {
            if (current.id === excludeExerciseId) return true;
            visited.add(current.id);
            current = exercises.find((e) => e.id === current!.parent);
        }
        return false;
    };
    const parentOptions = exercises.filter((exercise) => !exercise.isDeleted && !isSelfOrDescendant(exercise));

    return (
        <>
            <TextField
                label="Name"
                name="name"
                value={name}
                error={nameError}
                autoComplete="off"
                required
                autoFocus
                onChange={onNameChange}
            />
            <SearchableSelect<Exercise>
                label="Parent Exercise"
                name="parent"
                items={parentOptions}
                selectedItem={draftParent}
                error={parentError}
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
