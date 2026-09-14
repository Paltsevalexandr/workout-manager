import React, { Dispatch, SetStateAction } from 'react';
import Modal from '../../components/ui/Modal';
import ModalForm from '../../components/ui/ModalForm';
import { Exercise, Workout, WorkoutExercise } from '../../../_types';
import SelectField from '../../components/forms/SelectField';
import TextField from '../../components/forms/TextField';
import { Trash2, Plus } from "lucide-react"
import styles from "../page.module.scss";

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
                modalName={`${editWorkout ? "Edit" : "Create"} Workout`}
                submitText={`${editWorkout ? "Edit" : "Add"} Workout`}
                onSubmit={handleSubmit}
                onCancel={handleCancelForm}
            >
                {
                    exercises.length
                        ? <>
                            <TextField
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
                                            let id = workoutExercise.id;
                                            return (
                                                <div className={styles.newWorkoutExercise}
                                                    key={"workout_exercise_wrap_" + id}>
                                                    <SelectField
                                                        key={"workout_exercise_" + id}
                                                        label=""
                                                        name="workout-exercise[]"
                                                        value={workoutExercises[index].exerciseId}
                                                        options={exercises.map(exercise => exercise.id)}
                                                        optionsNames={exercises.map(exercise => exercise.name)}
                                                        parseValue={Number}
                                                        onChange={(value) => setWorkoutExercises((currentWorkoutExercises) => {
                                                            return currentWorkoutExercises.map((workoutExercise) => {
                                                                return id == workoutExercise.id
                                                                    ? {
                                                                        ...workoutExercise,
                                                                        exerciseId: value
                                                                    }
                                                                    : workoutExercise;
                                                            });
                                                        })}
                                                    />
                                                    <button type="button"
                                                        key={"delete_ex_btn_" + index}
                                                        onClick={() => deleteExercise(index)}
                                                        className={styles.newWorkoutDeleteExercise}>
                                                        <Trash2 size={16} key={"delete_ex_icon_" + index} />
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
