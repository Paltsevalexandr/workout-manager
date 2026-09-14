import React, { Dispatch, SetStateAction, type SubmitEvent } from 'react';
import ModalForm from '../ui/ModalForm';
import Modal from '../ui/Modal';
import NumberField from '../forms/NumberField';
import DateField from '../forms/DateField';
import { getExerciseById, getFormattedDate, isWorkoutPlan, isWorkoutSession } from '@/lib';
import { PerformedExercise, PlannedExercise, Workout, WorkoutExercise, WorkoutPlan, WorkoutSession } from '@/_types';
import styles from "../../page.module.scss";
import { useExercisesContext, useWorkoutsContext } from '@/app/providers';
import { SourceOfSession } from './WorkoutTracking';
import { ModalType } from "./WorkoutTracking";

type Props = {
    modalType: ModalType;
    session: WorkoutSession | WorkoutPlan | null;
    sessionFormSource: SourceOfSession;
    saveSession: (e: SubmitEvent<HTMLFormElement>) => void;
    cancelForm: () => void;
    setSessionFormSource: Dispatch<SetStateAction<SourceOfSession>>;
    setDate: (date: number) => void;
    handlePerformedExerciseChange: (value: number, workoutExerciseId: number, field: keyof PerformedExercise) => void;
}

export default function WorkoutTrackingModal({
    modalType,
    session,
    sessionFormSource,
    saveSession,
    cancelForm,
    setDate,
    setSessionFormSource,
    handlePerformedExerciseChange
}: Props) {
    const { exercises } = useExercisesContext();
    const { workouts } = useWorkoutsContext();

    function getWorkoutExerciseById(workoutExerciseId: number | null): WorkoutExercise | undefined {
        let workout = workouts.find(({ id }) => id == session?.workoutId);
        if (workout) {
            return workout.workoutExercises.find(({ id }) => id == workoutExerciseId);
        }
        return undefined;
    }
    let headerText = "";
    switch (modalType) {
        case "session":
            headerText = "Track Progress";
            break;
        case "plan":
            headerText = "Next Session Plan"
            break;
    }
    let header = <div className={styles.workoutSessionFormHeader}>
        <h2>{headerText}</h2>
        { /* TODO - consider hiding if create plan, not session */}
        <div className={styles.workoutSessionFormSourceWrap}>
            <button onClick={() => setSessionFormSource("prevSession")}
                type="button"
                className={
                    `${styles.workoutSessionFormSource} 
                ${sessionFormSource == "prevSession" ? styles.active : ""} 
                button-secondary`
                }>
                Prev Session
            </button>
            <button onClick={() => setSessionFormSource("plan")}
                type="button"
                className={
                    `${styles.workoutSessionFormSource} 
                    ${sessionFormSource == "plan" ? styles.active : ""} 
                    button-secondary`
                }>
                Plan
            </button>
        </div>
    </div>;

    let sourceExercises: PerformedExercise[] | PlannedExercise[] = [];
    if (isWorkoutSession(session)) {
        sourceExercises = session.performedExercises;
    }
    else if (isWorkoutPlan(session)) {
        sourceExercises = session.plannedExercises;
    }

    return (
        <Modal
            onClose={cancelForm}
        >
            <ModalForm
                header={header}
                submitText="Save Progress"
                onSubmit={saveSession}
                onCancel={cancelForm}
            >
                {
                    session &&
                    <DateField
                        label="Workout Date"
                        max={modalType == "session" ? Date.now() : null}
                        name="workout_session_date"
                        value={getFormattedDate(session.date)}
                        onChange={setDate}
                    />
                }
                {
                    session &&
                    <div className={styles.workoutSessionFormExercises}>
                        <div className={styles.workoutSessionFormExercisesHeader}>
                            <div>Exercise Name</div>
                            <div>Reps/Dur.</div>
                            <div>Sets</div>
                            <div>Rest</div>
                            <div>Weight</div>
                        </div>
                        {
                            sourceExercises.map((sessionExercise) => {
                                let workoutExercise = getWorkoutExerciseById(sessionExercise.workoutExerciseId)
                                let exercise = getExerciseById(exercises, workoutExercise?.exerciseId);
                                if (!exercise) {
                                    return null; // TODO - show error, not sure why it can happen at all
                                }
                                return (
                                    <div key={`workout_session_exercise_${sessionExercise.id}`}
                                        className={styles.workoutSessionFormExercisesItem}>
                                        <p>
                                            {exercise.name}
                                        </p>
                                        <NumberField
                                            label=""
                                            name="workout-exercise-target"
                                            value={sessionExercise.target}
                                            onChange={(value) => handlePerformedExerciseChange(value, sessionExercise.workoutExerciseId, "target")}
                                        />
                                        <NumberField
                                            label=""
                                            name="workout-exercise-sets"
                                            value={sessionExercise.sets}
                                            onChange={(value) => handlePerformedExerciseChange(value, sessionExercise.workoutExerciseId, "sets")}
                                        />
                                        <NumberField
                                            label=""
                                            name="workout-exercise-rest"
                                            value={sessionExercise.rest}
                                            onChange={(value) => handlePerformedExerciseChange(value, sessionExercise.workoutExerciseId, "rest")}
                                        />
                                        <NumberField
                                            label=""
                                            name="workout-exercise-weight"
                                            value={sessionExercise.weight}
                                            onChange={(value) => handlePerformedExerciseChange(value, sessionExercise.workoutExerciseId, "weight")}
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
