import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import Modal from "../components/ui/Modal";
import ModalForm from "../components/ui/ModalForm";
import { Exercise, Workout, WorkoutExerciseDraft } from "../../_types";
import TextField from "../components/forms/TextField";
import { Trash2, Plus } from "lucide-react"
import styles from "./WorkoutForm.module.scss";
import SearchableSelect from "../components/forms/SearchableSelect";

type Props = {
    editWorkout?: Workout | null;
    workoutName: string;
    exercises: Exercise[];
    workoutExercises: WorkoutExerciseDraft[];
    workoutExercisesError?: string;
    workoutNameError?: string;
    workoutError: string,
    submitDisabled: boolean,
    handleCancelForm: () => void;
    handleSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
    setWorkoutName: (name: string) => void;
    setWorkoutExercises: Dispatch<SetStateAction<WorkoutExerciseDraft[]>>;
}

export default function WorkoutForm({
    editWorkout,
    exercises,
    workoutExercises,
    workoutExercisesError,
    workoutNameError,
    workoutName,
    workoutError,
    submitDisabled,
    handleCancelForm,
    handleSubmit,
    setWorkoutName,
    setWorkoutExercises,

}: Props) {
    const activeExercises = exercises.filter(exercise => !exercise.isDeleted);
    const exercisesListRef = useRef<HTMLDivElement>(null);
    const prevExercisesCountRef = useRef(workoutExercises.length);

    useEffect(() => {
        // only scroll down when a row was added (not on delete),
        // so the newly added row is visible right away
        if (workoutExercises.length > prevExercisesCountRef.current) {
            const list = exercisesListRef.current;
            if (list) {
                list.scrollTop = list.scrollHeight;
            }
        }
        prevExercisesCountRef.current = workoutExercises.length;
    }, [workoutExercises.length]);

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
                submitDisabled={submitDisabled || activeExercises.length === 0}
                onSubmit={handleSubmit}
                onCancel={handleCancelForm}
            >
                {
                    activeExercises.length
                        ? <>
                            <TextField
                                autoFocus={true}
                                label="Workout Name"
                                name="workout-name"
                                value={workoutName}
                                error={workoutNameError}
                                autoComplete="off"
                                required={true}
                                onChange={setWorkoutName}
                            />
                            <div className={styles.newWorkoutExercisesWrap}>
                                <div className={styles.newWorkoutExercisesHeader}>
                                    <div>Exercise</div>
                                    <div>Delete</div>
                                </div>
                                <div className={styles.newWorkoutExercises} ref={exercisesListRef}>
                                    {
                                        workoutExercises.map((workoutExercise, index) => {
                                            const selectedExercise = exercises.find(
                                                exercise => exercise.id === workoutExercise.exerciseId
                                            ) ?? null;
                                            return (
                                                <div key={"form_workout_exercise_" + index}>
                                                    <div className={styles.newWorkoutExercise}>
                                                        <SearchableSelect
                                                            label=""
                                                            name="workout_exercise[]"
                                                            items={activeExercises}
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
                                                    {
                                                        selectedExercise?.isDeleted &&
                                                        <p className={styles.error}>
                                                            This exercise was removed from the catalog — please choose another
                                                        </p>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            {workoutExercisesError && <p className={styles.error}>{workoutExercisesError}</p>}
                            {workoutError && <p className={styles.error}>{workoutError}</p>}
                            <button
                                type="button"
                                onClick={
                                    () => setWorkoutExercises([
                                        ...workoutExercises,
                                        {
                                            id: null,
                                            exerciseId: 0,
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
