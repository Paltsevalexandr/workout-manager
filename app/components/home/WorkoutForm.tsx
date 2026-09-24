import React, { Dispatch, SetStateAction } from 'react';
import Modal from '../../components/ui/Modal';
import ModalForm from '../../components/ui/ModalForm';
import { Exercise, Workout, WorkoutExercise } from '../../../_types';
import TextField from '../../components/forms/TextField';
import { Trash2, Plus } from "lucide-react"
import styles from "./WorkoutForm.module.scss";
import SearchableSelect from '../forms/SearchableSelect';

type Props = {
    editWorkout?: Workout | null;
    workoutName: string;
    exercises: Exercise[];
    workoutExercises: WorkoutExercise[];
    handleCancelForm: () => void;
    handleSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
    setWorkoutName: (name: string) => void;
    setWorkoutExercises: Dispatch<SetStateAction<WorkoutExercise[]>>;
}

export default function WorkoutForm({
    editWorkout,
    exercises,
    workoutExercises,
    workoutName,
    handleCancelForm,
    handleSubmit,
    setWorkoutName,
    setWorkoutExercises,

}: Props) {

    function deleteExercise(index: number) {
        setWorkoutExercises((currentExercises) => {
            return currentExercises.filter((_, i) => i != index);
        });
    }

    return (
        <Modal onClose={handleCancelForm}>
            <ModalForm
                className={styles.newWorkout}
                title={`${editWorkout ? "Edit" : "Create"} Workout`}
                submitText={`${editWorkout ? "Edit" : "Add"} Workout`}
                onSubmit={handleSubmit}
                onCancel={handleCancelForm}
            >
                {
                    exercises.length
                        ? <>
                            <TextField
                                autoFocus={true}
                                label="Workout Name"
                                name="workout-name"
                                value={workoutName}
                                required={true}

                                onChange={setWorkoutName}
                            />
                            <div className={styles.newWorkoutExercisesWrap}>
                                <div className={styles.newWorkoutExercisesHeader}>
                                    <div>Exercise</div>
                                    <div>Delete</div>
                                </div>
                                <div className={styles.newWorkoutExercises}>
                                    {
                                        workoutExercises.map((workoutExercise, index) => {
                                            const selectedExercise = exercises.find(
                                                exercise => exercise.id === workoutExercise.exerciseId
                                            ) ?? null;
                                            return (
                                                <div className={styles.newWorkoutExercise}
                                                    key={"form_workout_exercise_" + index}>
                                                    <SearchableSelect
                                                        label=""
                                                        name="workout_exercise[]"
                                                        items={exercises}
                                                        selectedItem={selectedExercise}
                                                        setSelectedItem={(value) => setWorkoutExercises((currentWorkoutExercises) => {
                                                            return currentWorkoutExercises.map((workoutExercise, i) => {
                                                                if (i != index) {
                                                                    return workoutExercise;
                                                                }
                                                                const nextExercise = typeof value === "function"
                                                                    ? value(selectedExercise)
                                                                    : value;
                                                                return {
                                                                    ...workoutExercise,
                                                                    exerciseId: nextExercise?.id ?? 0
                                                                };
                                                            });
                                                        })}
                                                    />
                                                    <button type="button"
                                                        onClick={() => deleteExercise(index)}
                                                        className={styles.newWorkoutDeleteExercise}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <button
                                className="button-secondary"
                                type="button"
                                onClick={
                                    () => setWorkoutExercises([
                                        ...workoutExercises,
                                        {
                                            id: null,
                                            workoutTemplateId: editWorkout?.id ?? null,
                                            exerciseId: 0
                                        }
                                    ])
                                }
                            >
                                <span><Plus size={16} /></span> Add Exercise
                            </button>

                        </>
                        : <p>Add some exercises to create workout</p>
                }
            </ModalForm>
        </Modal>
    )
}
