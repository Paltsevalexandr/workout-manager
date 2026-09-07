import React, { Dispatch, SetStateAction } from 'react';
import Modal from '../../components/ui/Modal';
import ModalForm from '../../components/ui/ModalForm';
import { Exercise, Workout } from '../../_types';
import SelectField from '../../components/forms/SelectField';
import TextField from '../../components/forms/TextField';
import { Trash2, Plus } from "lucide-react"
import styles from "../page.module.scss";

type Props = {
    workoutName: string,
    exercises: Exercise[],
    workoutExercises: Exercise["id"][],
    handleCancelForm: () => void,
    handleSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void,
    setWorkoutName: (name: string) => void,
    setWorkoutExercises: Dispatch<SetStateAction<Exercise["id"][]>>,
}

export default function WorkoutForm({
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
                modalName='New Workout'
                submitText="Add workout"
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
                                    {/* <div>Reps/Dur.</div>
                                    <div>Sets</div>
                                    <div>Weight (kg)</div>
                                    <div>Rest (sec)</div> */}
                                    <div>Delete</div>
                                </div>
                                <div className={styles.newWorkoutExercises}>
                                    {
                                        workoutExercises.map((exerciseId, index) => {
                                            return (
                                                <div className={styles.newWorkoutExercise}
                                                    key={exerciseId + "_" + index + "_workout_exercise_wrap"}>
                                                    <SelectField
                                                        key={exerciseId + "_" + index + "_workout_exercise"}
                                                        label=""
                                                        name="workout-exercise[]"
                                                        value={workoutExercises[index]}
                                                        options={exercises.map(exercise => exercise.id)}
                                                        optionsNames={exercises.map(exercise => exercise.name)}
                                                        parseValue={Number}
                                                        onChange={(value) => setWorkoutExercises((currentWorkoutExercises) => {
                                                            return currentWorkoutExercises.map((exerciseId, i) => {
                                                                return index == i ? value : exerciseId;
                                                            });
                                                        })}
                                                    />
                                                    {/* <NumberField
                                                        key={exerciseId + "_" + index + "_workout_exercise_target"}
                                                        label=""
                                                        name="workout-exercise-target"
                                                        value={workoutExercises[index].target}
                                                        onChange={(value) => setWorkoutExercises((currentWorkoutExercises) => {
                                                            return currentWorkoutExercises.map((exercise, i) => {
                                                                return index == i
                                                                    ? { ...exercise, target: value }
                                                                    : exercise;
                                                            });
                                                        })}
                                                    />
                                                    <NumberField
                                                        key={exercise.exerciseId + "_" + index + "_workout_exercise_sets"}
                                                        label=""
                                                        name="workout-exercise-sets"
                                                        value={workoutExercises[index].sets}
                                                        onChange={(value) => setWorkoutExercises((currentWorkoutExercises) => {
                                                            return currentWorkoutExercises.map((exercise, i) => {
                                                                return index == i
                                                                    ? { ...exercise, sets: value }
                                                                    : exercise;
                                                            });
                                                        })}
                                                    />
                                                    <NumberField
                                                        key={exercise.exerciseId + "_" + index + "_workout_exercise_weight"}
                                                        label=""
                                                        name="workout-exercise-weight"
                                                        value={workoutExercises[index].weight}
                                                        onChange={(value) => setWorkoutExercises((currentWorkoutExercises) => {
                                                            return currentWorkoutExercises.map((exercise, i) => {
                                                                return index == i
                                                                    ? { ...exercise, weight: value }
                                                                    : exercise;
                                                            });
                                                        })}
                                                    />
                                                    <NumberField
                                                        key={exercise.exerciseId + "_" + index + "_workout_exercise_rest"}
                                                        label=""
                                                        name="workout-exercise-rest"
                                                        value={workoutExercises[index].rest}
                                                        onChange={(value) => setWorkoutExercises((currentWorkoutExercises) => {
                                                            return currentWorkoutExercises.map((exercise, i) => {
                                                                return index == i
                                                                    ? { ...exercise, rest: value }
                                                                    : exercise;
                                                            });
                                                        })}
                                                    /> */}
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
                                disabled={exercises.length == 0}
                                onClick={() => setWorkoutExercises([...workoutExercises, 0])}
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
