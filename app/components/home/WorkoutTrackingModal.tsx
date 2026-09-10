import React, { type SubmitEvent } from 'react';
import ModalForm from '../ui/ModalForm';
import Modal from '../ui/Modal';
import NumberField from '../forms/NumberField';
import DateField from '../forms/DateField';
import { getExerciseById, getFormattedDate } from '@/lib';
import { PerformedExercise, WorkoutSession } from '@/app/_types';
import styles from "../../page.module.scss";
import { useExercisesContext } from '@/app/providers';

type Props = {
    isModalFormOpen: boolean;
    workoutSession: WorkoutSession | null;
    saveSession: (e: SubmitEvent<HTMLFormElement>) => void;
    cancelForm: () => void;
    setDate: (date: number) => void;
    handlePerformedExerciseChange: (value: number, exerciseId: number, field: keyof PerformedExercise) => void;
}

export default function WorkoutTrackingModal({
    isModalFormOpen,
    workoutSession,
    saveSession,
    cancelForm,
    setDate,
    handlePerformedExerciseChange
}: Props) {
    const { exercises } = useExercisesContext();

    return (isModalFormOpen
        && <Modal
            onClose={cancelForm}
        >
            <ModalForm
                modalName="Track Progress"
                submitText="Save Progress"
                onSubmit={saveSession}
                onCancel={cancelForm}
            >
                {
                    workoutSession &&
                    <DateField
                        label="Workout Date"
                        max={Date.now()}
                        name="workout_session_date"
                        value={getFormattedDate(workoutSession.date)}
                        onChange={setDate}
                    />
                }
                {
                    workoutSession &&
                    <div className={styles.workoutSession}>
                        <div className={styles.workoutSessionHeader}>
                            <div>Exercise Name</div>
                            <div>Reps/Dur.</div>
                            <div>Sets</div>
                            <div>Rest</div>
                            <div>Weight</div>
                        </div>
                        {
                            workoutSession.performedExercises.map((performedExercise, index) => {
                                let exercise = getExerciseById(exercises, performedExercise.exerciseId);
                                if (!exercise) {
                                    return null;
                                }
                                return (
                                    <div key={`workout_session_exercise_${index}`}
                                        className={styles.workoutSessionExercise}>
                                        <p key={`workout_session_exercise_${index}`}>
                                            {exercise.name}
                                        </p>
                                        <NumberField
                                            key={`workout_session_exercise_target_${index}`}
                                            label=""
                                            name="workout-exercise-target"
                                            value={performedExercise.target}
                                            onChange={(value) => handlePerformedExerciseChange(value, performedExercise.exerciseId, "target")}
                                        />
                                        <NumberField
                                            key={`workout_session_exercise_sets_${index}`}
                                            label=""
                                            name="workout-exercise-sets"
                                            value={performedExercise.sets}
                                            onChange={(value) => handlePerformedExerciseChange(value, performedExercise.exerciseId, "sets")}
                                        />
                                        <NumberField
                                            key={`workout_session_exercise_rest_${index}`}
                                            label=""
                                            name="workout-exercise-rest"
                                            value={performedExercise.rest}
                                            onChange={(value) => handlePerformedExerciseChange(value, performedExercise.exerciseId, "rest")}
                                        />
                                        <NumberField
                                            key={`workout_session_exercise_weight_${index}`}
                                            label=""
                                            name="workout-exercise-weight"
                                            value={performedExercise.weight}
                                            onChange={(value) => handlePerformedExerciseChange(value, performedExercise.exerciseId, "weight")}
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </ModalForm>
        </Modal>
    )
}
