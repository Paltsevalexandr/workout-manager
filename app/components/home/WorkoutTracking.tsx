"use client";

import React, {
    useState,
    type SubmitEvent
} from 'react';
import styles from "../../page.module.scss";
import { useExercisesContext, usePerformedSessionsContext, usePlannedSessionsContext, useWorkoutsContext } from '@/app/providers';
import WorkoutsList from "./WorkoutList";
import { ModalType, PerformedExercise, PlannedExercise, SessionFormSource, Workout, WorkoutPlan, WorkoutSession } from '@/_types';
import WorkoutTrackingModal from '../WorkoutTrackingModal';
import {
    buildPerformedSession,
    buildPlannedSession,
    generateID,
} from '@/lib';
import WorkoutDetails from './WorkoutDetails';

type Props = {}

export default function WorkoutTracking({ }: Props) {
    const { workouts } = useWorkoutsContext();
    const { performedSessions, setPerformedSessions: setWorkoutSessions } = usePerformedSessionsContext();
    const { plannedSessions, setPlannedSessions } = usePlannedSessionsContext();
    const [modalType, setModalType] = useState<ModalType>("none");
    const [performedSession, setPerformedSession] = useState<WorkoutSession | null>(null);
    const [plannedSession, setPlannedSession] = useState<WorkoutPlan | null>(null);
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
    const [sessionFormSource, setSessionFormSource] = useState<SessionFormSource>("none");

    function toggleSessionFormSource(source: SessionFormSource, workoutId: number) {
        if (source === sessionFormSource) return;
        switch (modalType) {
            case "session":
                createPerformedSession(workoutId, source);
                break;
        }
    }
    function createNextSessionPlan(workoutId: number) {
        const workout = getWorkout(workoutId);
        if (!workout) return;

        const { plan, sessionFormSource } = buildPlannedSession(workout, performedSessions, plannedSessions);
        setSessionFormSource(sessionFormSource);
        setPlannedSession(plan);
        setModalType("plan");
    }
    function createPerformedSession(workoutId: number, source?: SessionFormSource) {
        const workout = getWorkout(workoutId);
        if (!workout) return;

        const { session, sessionFormSource } = buildPerformedSession(
            workout, performedSessions, plannedSessions,
            { source, date: performedSession?.date }
        );
        setSessionFormSource(sessionFormSource);
        setPerformedSession(session);
        setModalType("session");
    }
    function getWorkout(workoutId: number): Workout | null {
        return workouts.find(workout => workout.id == workoutId) ?? null;
    }
    function saveSession(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (modalType == "plan" && plannedSession) {
            setPlannedSessions(prevSessions => [
                ...prevSessions,
                {
                    ...plannedSession,
                    id: generateID(plannedSessions)
                }
            ]);
        }
        else if (modalType == "session" && performedSession) {
            setWorkoutSessions(prevSessions => [
                ...prevSessions,
                {
                    ...performedSession,
                    id: generateID(performedSessions)
                }
            ])
        }
        setModalType("none");
        setSessionFormSource("none");
        setPerformedSession(null);
        setPlannedSession(null);
    }
    function cancelForm() {
        setModalType("none");
        setSessionFormSource("none");
        setPerformedSession(null);
        setPlannedSession(null);
    }
    function setDate(date: number) {
        if (modalType == "session") {
            setPerformedSession((prevSession): WorkoutSession | null => {
                if (!prevSession) {
                    return null;
                }
                return {
                    ...prevSession,
                    date
                }
            });
        }
        else if (modalType == "plan") {
            setPlannedSession((prevSession): WorkoutPlan | null => {
                if (!prevSession) {
                    return null;
                }
                return {
                    ...prevSession,
                    date
                }
            });
        }
    }
    function handlePerformedExerciseChange(
        value: number,
        workoutExerciseId: number,
        field: keyof PerformedExercise | keyof PlannedExercise
    ) {
        if (modalType == "session") {
            setPerformedSession(prevSession => {
                if (!prevSession) {
                    return prevSession;
                }
                else {
                    return {
                        ...prevSession,
                        performedExercises: prevSession.performedExercises.map((ex) => {
                            if (ex.workoutExerciseId == workoutExerciseId) {
                                return {
                                    ...ex,
                                    [field]: value
                                }
                            }
                            return ex;
                        })
                    }
                }
            });
        }
        else if (modalType == "plan") {
            setPlannedSession(prevSession => {
                if (!prevSession) {
                    return prevSession;
                }
                else {
                    return {
                        ...prevSession,
                        plannedExercises: prevSession.plannedExercises.map((ex) => {
                            if (ex.workoutExerciseId == workoutExerciseId) {
                                return {
                                    ...ex,
                                    [field]: value
                                }
                            }
                            return ex;
                        })
                    }
                }
            });
        }
    }
    function getSession(): WorkoutSession | WorkoutPlan | null {
        switch (modalType) {
            case "plan":
                return plannedSession;
            case "session":
                return performedSession;
            default:
                return null;
        }
    }

    const session: WorkoutSession | WorkoutPlan | null = getSession();
    return (
        <main>
            <section>
                <div className="section-content">
                    <div className={styles.workoutColumns}>
                        <WorkoutsList
                            selectedWorkout={selectedWorkout}
                            workoutSessions={performedSessions}
                            plannedSessions={plannedSessions}
                            setSelectedWorkout={setSelectedWorkout}
                        />
                        {
                            selectedWorkout &&
                            <WorkoutDetails
                                workout={selectedWorkout}
                                workoutSessions={performedSessions}
                                savePerformedSession={createPerformedSession}
                                createNextSessionPlan={createNextSessionPlan}
                            />
                        }
                    </div>
                    {
                        modalType != "none" && session
                        && <WorkoutTrackingModal
                            modalType={modalType}
                            workoutSessions={performedSessions}
                            plannedSessions={plannedSessions}
                            setDate={setDate}
                            sessionFormSource={sessionFormSource}
                            session={session}
                            saveSession={saveSession}
                            cancelForm={cancelForm}
                            toggleSessionFormSource={toggleSessionFormSource}
                            handlePerformedExerciseChange={handlePerformedExerciseChange}
                        />
                    }
                </div>
            </section>
        </main>
    )
}
