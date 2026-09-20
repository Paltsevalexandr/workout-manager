"use client";

import { useState, type SubmitEvent } from 'react';
import Content from '@/app/components/layout/Content';
import { usePerformedSessionsContext, usePlannedSessionsContext, useWorkoutsContext } from '@/app/providers';
import { useParams } from 'next/navigation';
import { PerformedExercise, SessionFormSource, WorkoutSession } from '@/_types';
import { buildPerformedSession, generateID } from '@/lib';
import WorkoutTrackingModal from '@/app/components/WorkoutTrackingModal';

import styles from "./page.module.scss";
import ByDate from './_components/ByDate';
import ByExercise from './_components/ByExercise';

type Props = {}

type ViewMode = "byDate" | "byExercise";

export default function page({ }: Props) {
    let { workoutId } = useParams<{ workoutId: string }>();
    const { workouts } = useWorkoutsContext();
    const { performedSessions, setPerformedSessions } = usePerformedSessionsContext();
    const { plannedSessions } = usePlannedSessionsContext();
    const [viewMode, setViewMode] = useState<ViewMode>("byDate");
    const [newSession, setNewSession] = useState<WorkoutSession | null>(null);
    const [sessionFormSource, setSessionFormSource] = useState<SessionFormSource>("none");
    const workout = workouts.find(w => w.id === Number(workoutId));

    const workoutPerformedSessions = performedSessions
        .filter(session => session.workoutId == workout?.id);

    function createNewSession() {
        if (!workout) return;

        const { session, sessionFormSource } = buildPerformedSession(workout, performedSessions, plannedSessions);
        setSessionFormSource(sessionFormSource);
        setNewSession(session);
    }

    function toggleSessionFormSource(source: SessionFormSource) {
        if (!workout || source === sessionFormSource) return;

        const { session } = buildPerformedSession(
            workout, performedSessions, plannedSessions,
            { source, date: newSession?.date }
        );
        setSessionFormSource(source);
        setNewSession(session);
    }

    function setNewSessionDate(date: number) {
        setNewSession(prev => prev ? { ...prev, date } : prev);
    }

    function handleNewSessionExerciseChange(
        value: number,
        workoutExerciseId: number,
        field: keyof PerformedExercise
    ) {
        setNewSession(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                performedExercises: prev.performedExercises.map(performedExercise =>
                    performedExercise.workoutExerciseId === workoutExerciseId
                        ? { ...performedExercise, [field]: value }
                        : performedExercise
                ),
            };
        });
    }

    function saveNewSession(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!newSession) return;
        setPerformedSessions(prev => [
            ...prev,
            { ...newSession, id: generateID(prev) },
        ]);
        setNewSession(null);
        setSessionFormSource("none");
    }

    function cancelNewSession() {
        setNewSession(null);
        setSessionFormSource("none");
    }

    return (
        <Content title={workout ? `${workout.name} History` : "History"}>
            <section>
                <div className="section-content">
                    <div className={styles.controls}>
                        {workout && workoutPerformedSessions.length > 0
                            && <button
                                className={`${styles.controlsBtn} button-secondary ${viewMode == "byDate" ? styles.active : ""}`}
                                onClick={() => setViewMode("byDate")}
                            >
                                By Date
                            </button>
                        }
                        {
                            workout && workoutPerformedSessions.length > 0
                            && <button
                                className={`${styles.controlsBtn} button-secondary ${viewMode == "byExercise" ? styles.active : ""}`}
                                onClick={() => setViewMode("byExercise")}
                            >
                                By Exercise
                            </button>}
                        {
                            workout && viewMode == "byDate"
                            &&
                            <button
                                className={`${styles.controlsBtn} button-secondary ${styles.controlsBtnAddSession}`}
                                onClick={createNewSession}
                            >
                                Add Session
                            </button>
                        }
                    </div>
                    {
                        !workout
                            ? <p>Workout not found</p>
                            : !workoutPerformedSessions.length
                                ? <p>You haven't trained yet.</p>
                                : <>

                                    {viewMode === "byDate"
                                        ? <ByDate
                                            workout={workout}
                                            performedSessions={workoutPerformedSessions}
                                        />
                                        : <ByExercise
                                            workout={workout}
                                            performedSessions={workoutPerformedSessions}
                                        />
                                    }
                                </>
                    }
                    {
                        newSession &&
                        <WorkoutTrackingModal
                            modalType="session"
                            session={newSession}
                            sessionFormSource={sessionFormSource}
                            plannedSessions={plannedSessions}
                            workoutSessions={workoutPerformedSessions}
                            saveSession={saveNewSession}
                            cancelForm={cancelNewSession}
                            setDate={setNewSessionDate}
                            toggleSessionFormSource={toggleSessionFormSource}
                            handlePerformedExerciseChange={handleNewSessionExerciseChange}
                        />
                    }
                </div>
            </section>
        </Content>
    )
}
