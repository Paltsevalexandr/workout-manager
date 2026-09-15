"use client";

import React, {
    useState,
    type SubmitEvent
} from 'react';
import styles from "../../page.module.scss";
import { useExercisesContext, useWorkoutsContext } from '@/app/providers';
import WorkoutsList from "./WorkoutList";
import { PerformedExercise, PlannedExercise, Workout, WorkoutPlan, WorkoutSession } from '@/_types';
import WorkoutTrackingModal from './WorkoutTrackingModal';
import {
    generateID, getLastSession, getLatestPerformedExercise,
    getPlannedExercise, getPlannedSession, isWorkoutPlan, isWorkoutSession
} from '@/lib';
import WorkoutDetails from './WorkoutDetails';

type Props = {}
export type SessionFormSource = "none" | "prevSession" | "plan";
export type ModalType = "none" | "session" | "plan";

export default function WorkoutTracking({ }: Props) {
    const { workouts } = useWorkoutsContext();
    const [modalType, setModalType] = useState<ModalType>("none");
    const [performedSession, setPerformedSession] = useState<WorkoutSession | null>(null);
    const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([
        {
            date: 1788894136955,
            id: 1,
            performedExercises: [
                { id: 1, workoutExerciseId: 0, sets: 1, target: 1, weight: 0, rest: 1 },
                { id: 2, workoutExerciseId: 1, sets: 1, target: 1, weight: 0, rest: 1 },
                { id: 3, workoutExerciseId: 2, sets: 1, target: 1, weight: 0, rest: 1 },
                { id: 4, workoutExerciseId: 3, sets: 1, target: 1, weight: 0, rest: 1 },
                { id: 5, workoutExerciseId: 4, sets: 1, target: 1, weight: 0, rest: 1 },
                { id: 6, workoutExerciseId: 5, sets: 1, target: 1, weight: 0, rest: 1 },


            ],
            workoutId: 1
        },
        {
            date: 1788894136955,
            id: 2,
            performedExercises: [
                { id: 7, workoutExerciseId: 6, sets: 1, target: 1, weight: 0, rest: 1 },
                { id: 8, workoutExerciseId: 7, sets: 1, target: 1, weight: 0, rest: 1 },
                { id: 9, workoutExerciseId: 8, sets: 1, target: 1, weight: 0, rest: 1 },
                { id: 10, workoutExerciseId: 9, sets: 1, target: 1, weight: 0, rest: 1 }

            ],
            workoutId: 2
        }
    ]);
    const [plannedSession, setPlannedSession] = useState<WorkoutPlan | null>(null);
    const [plannedSessions, setPlannedSessions] = useState<WorkoutPlan[]>([]);
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
        if (!workout) {
            return;
        }
        const lastSession = getLastSession(workoutId, workoutSessions);
        // const currentPlannedSession = getPlannedSession(workoutId, plannedSessions);
        const sessionSource = getDefaultSessionSource(lastSession);
        setSessionFormSource(sessionSource);
        // temp code
        let newPlannedExerciseId = generateID(getAllPlannedExercises());
        // temp code end
        const plannedExercises: PlannedExercise[] = createSessionExercises(
            workout, lastSession, newPlannedExerciseId
        ) as PlannedExercise[];

        setPlannedSession({
            id: null,
            workoutId: workoutId,
            date: Date.now(),
            plannedExercises
        });
        setModalType("plan");
    }
    function createPerformedSession(workoutId: number, source?: SessionFormSource) {
        const workout = getWorkout(workoutId);
        if (!workout) return;

        // temp code
        let newPerformedExerciseId = generateID(getAllPerformedExercises());
        // temp code end

        const lastSession = getLastSession(workoutId, workoutSessions);
        const currentPlannedSession = getPlannedSession(workoutId, plannedSessions);
        let sessionSource = getDefaultSessionSource(lastSession, currentPlannedSession);
        let sessionSourceObj = currentPlannedSession ?? lastSession;
        if (source) {
            sessionSource = source;
            switch (sessionSource) {
                case ("plan"):
                    sessionSourceObj = currentPlannedSession;
                    break;
                case ("prevSession"):
                    sessionSourceObj = lastSession;
                    break;
            }
        }
        setSessionFormSource(sessionSource);
        let performedExercises: PerformedExercise[] = createSessionExercises(
            workout, sessionSourceObj, newPerformedExerciseId
        )

        setPerformedSession({
            id: null,
            workoutId: workoutId,
            date: performedSession?.date ?? Date.now(),
            performedExercises
        });
        setModalType("session");
    }
    function getAllPerformedExercises(): PerformedExercise[] {
        let allPerformedExercises: PerformedExercise[] = [];
        workoutSessions.forEach(session => allPerformedExercises.push(...session.performedExercises));
        return allPerformedExercises;
    }
    function getAllPlannedExercises(): PlannedExercise[] {
        let allPlannedExercises: PlannedExercise[] = [];
        plannedSessions.forEach(session => allPlannedExercises.push(...session.plannedExercises));
        return allPlannedExercises;
    }
    function getDefaultSessionSource(
        lastSession: WorkoutSession | null, currentPlannedSession?: WorkoutPlan | null
    ): SessionFormSource {
        if (currentPlannedSession) {
            return "plan";
        }
        else if (lastSession) {
            return "prevSession";
        }
        else {
            return "none";
        }
    }
    function getWorkout(workoutId: number): Workout | null {
        return workouts.find(workout => workout.id == workoutId) ?? null;
    }
    function createSessionExercises(
        workout: Workout,
        sourceSession: WorkoutSession | WorkoutPlan | null,
        newSessionExerciseId: number
    ): PerformedExercise[] | PlannedExercise[] {
        let sessionExercises: PerformedExercise[] | PlannedExercise[] = [];
        workout.workoutExercises.forEach((workoutExercise, i) => {
            if (workoutExercise.id !== null) {
                const sessionExercise: PerformedExercise | PlannedExercise = createSessionExercise(
                    sourceSession, newSessionExerciseId + i, workoutExercise.id
                );
                sessionExercises.push(sessionExercise);
            }
            else {
                console.warn("workoutExercise id is null", workoutExercise);
            }
        });
        return sessionExercises;
    }
    function createSessionExercise(
        source: WorkoutSession | WorkoutPlan | null, // PlannedSession or last PerformedSession
        newObjectId: number,
        workoutExerciseId: number
    ): PerformedExercise | PlannedExercise {
        let sourceExercise = isWorkoutSession(source)
            ? getLatestPerformedExercise(source, workoutExerciseId)
            : isWorkoutPlan(source)
                ? getPlannedExercise(source, workoutExerciseId)
                : null

        return {
            id: newObjectId,
            workoutExerciseId: workoutExerciseId,
            sets: sourceExercise?.sets ?? 1,
            target: sourceExercise?.target ?? 1,
            weight: sourceExercise?.weight ?? 0,
            rest: sourceExercise?.rest ?? 1,
        }
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
                    id: generateID(workoutSessions)
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
                            workoutSessions={workoutSessions}
                            plannedSessions={plannedSessions}
                            setSelectedWorkout={setSelectedWorkout}
                        />
                        {
                            selectedWorkout &&
                            <WorkoutDetails
                                workout={selectedWorkout}
                                workoutSessions={workoutSessions}
                                savePerformedSession={createPerformedSession}
                                createNextSessionPlan={createNextSessionPlan}
                            />
                        }
                    </div>
                    {
                        modalType != "none" && session
                        && <WorkoutTrackingModal
                            modalType={modalType}
                            workoutSessions={workoutSessions}
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
