import React, { Dispatch, SetStateAction } from 'react';
import Modal from '../../components/ui/Modal';
import ModalForm from '../../components/ui/ModalForm';
import { days, Day, Exercise, WorkoutExercise } from '../../_types';
import SelectField from '../../components/forms/SelectField';
import { capitalize, dayNames } from "../../lib";
import TextField from '../../components/forms/TextField';
import NumberField from '../../components/forms/NumberField';
import { Trash2, Plus } from "lucide-react"
import styles from "../page.module.scss";

type Props = {
    workoutName: string,
    workoutDay: number,
    exercises: Exercise[],
    workoutExercises: WorkoutExercise[],
    handleCancelForm: () => void,
    handleSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void,
    setWorkoutName: (name: string) => void,
    setWorkoutDay: (day: Day) => void,
    setWorkoutExercises: Dispatch<SetStateAction<WorkoutExercise[]>>,

}

export default function WorkoutForm({
    exercises,
    workoutExercises,
    workoutName,
    workoutDay,
    handleCancelForm,
    handleSubmit,
    setWorkoutName,
    setWorkoutDay,
    setWorkoutExercises,

}: Props) {
    let workoutExerciseLayout = {
        id: null,
        exerciseId: exercises[0]?.id ?? -1,
        sets: 1,
        target: 1,
        weight: 0,
        rest: 30
    };
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
                            <SelectField
                                label="Day"
                                name="day"
                                value={workoutDay}
                                options={days}
                                optionsNames={dayNames}
                                parseValue={(value) => Number(value) as Day}
                                onChange={setWorkoutDay}
                            />
                            <div className={styles.newWorkoutExercisesWrap}>
                                <div className={styles.newWorkoutExercisesHeader}>
                                    <div>Exercise</div>
                                    <div>Reps/Dur.</div>
                                    <div>Sets</div>
                                    <div>Weight (kg)</div>
                                    <div>Rest (sec)</div>
                                    <div>Delete</div>
                                </div>
                                <div className={styles.newWorkoutExercises}>
                                    {
                                        workoutExercises.map((exercise, index) => {
                                            return (
                                                <div className={styles.newWorkoutExercise}
                                                    key={exercise.exerciseId + "_" + index + "_workout_exercise_wrap"}>
                                                    <SelectField
                                                        key={exercise.exerciseId + "_" + index + "_workout_exercise"}
                                                        label=""
                                                        name="workout-exercise[]"
                                                        value={workoutExercises[index].exerciseId}
                                                        options={exercises.map(exercise => exercise.id)}
                                                        optionsNames={exercises.map(exercise => exercise.name)}
                                                        parseValue={Number}
                                                        onChange={(value) => setWorkoutExercises((currentWorkoutExercises) => {
                                                            return currentWorkoutExercises.map((exercise, i) => {
                                                                return index == i
                                                                    ? { ...exercise, exerciseId: value }
                                                                    : exercise;
                                                            });
                                                        })}
                                                    />
                                                    <NumberField
                                                        key={exercise.exerciseId + "_" + index + "_workout_exercise_target"}
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
                                                    />
                                                    <div>
                                                        <button type="button" className={styles.newWorkoutDeleteExercise}>
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
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
                                onClick={() => setWorkoutExercises([...workoutExercises, { ...workoutExerciseLayout }])}
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
