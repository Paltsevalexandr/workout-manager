import React, { type SubmitEvent } from 'react';
import ModalForm from './ui/ModalForm';
import Modal from './ui/Modal';
import NumberField from './forms/NumberField';
import DateField from './forms/DateField';
import { getExerciseById, getFormattedDate, getLastSession, getPlannedSession, isPlannedSession, isPerformedSession } from '@/lib';
import { ModalType, PerformedExercise, PlannedExercise, SessionFormSource, WorkoutExercise, PlannedSession, PerformedSession } from '@/_types';
import styles from "./WorkoutTrackingModal.module.scss";
import { useExercisesContext, useWorkoutsContext } from '@/app/providers';

type Props = {
    modalType: ModalType;
    session: PerformedSession | PlannedSession;
    sessionFormSource: SessionFormSource;
    plannedSessions: PlannedSession[];
    performedSessions: PerformedSession[];
    workoutName: string;
    saveSession: (e: SubmitEvent<HTMLFormElement>) => void;
    cancelForm: () => void;
    toggleSessionFormSource?: (source: SessionFormSource, workoutId: number) => void;
    setDate: (date: number) => void;
    handlePerformedExerciseChange: (value: number, workoutExerciseId: number, field: keyof PerformedExercise) => void;
}

export default function WorkoutTrackingModal({
    modalType,
    session,
    sessionFormSource,
    performedSessions,
    plannedSessions,
    workoutName,
    saveSession,
    cancelForm,
    setDate,
    toggleSessionFormSource = () => { },
    handlePerformedExerciseChange
}: Props) {
    const { exercises } = useExercisesContext();
    const { workouts } = useWorkoutsContext();
    const { workoutId } = session;

    function getWorkoutExerciseById(workoutExerciseId: number | null): WorkoutExercise | undefined {
        let workout = workouts.find(({ id }) => id == workoutId);
        if (workout) {
            return workout.workoutExercises.find(({ id }) => id == workoutExerciseId);
        }
        return undefined;
    }
    let headerText = "";
    switch (modalType) {
        case "session":
            headerText = `Track ${workoutName ? `"${workoutName}" ` : ""}Progress`;
            break;
        case "plan":
            headerText = `${workoutName ? `"${workoutName}" ` : ""}Next Session Plan`
            break;
    }
    const lastSession = getLastSession(workoutId, performedSessions);
    const plannedSession = getPlannedSession(workoutId, plannedSessions);
    const showSourceToggle = modalType === "session" && plannedSession && lastSession;

    let header = <div className={styles.workoutSessionFormHeader}>
        <h2>{headerText}</h2>
        <div className={styles.workoutSessionFormSourceWrap}>
            <button onClick={() => toggleSessionFormSource("prevSession", workoutId)}
                type="button"
                className={
                    `${styles.workoutSessionFormSource} 
                ${sessionFormSource == "prevSession" ? styles.active : ""} 
                button-secondary`
                }>
                Last Session
            </button>
            <button onClick={() => toggleSessionFormSource("plan", workoutId)}
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

    let sourceExercises: PerformedExercise[] | PlannedExercise[] = isPerformedSession(session)
        ? session.performedExercises
        : session.plannedExercises;

    return (
        <Modal
            onClose={cancelForm}
        >
            <ModalForm
                header={showSourceToggle ? header : undefined}
                title={!showSourceToggle ? headerText : undefined}
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
