"use client";

import { useState, type SubmitEvent } from 'react';
import Content from '@/app/components/layout/Content';
import { useExercisesContext, usePerformedSessionsContext, usePlannedSessionsContext, useWorkoutsContext } from '@/app/providers';
import { useParams } from 'next/navigation';
import { Exercise, PerformedExercise, SessionFormSource, Workout, WorkoutExercise, PerformedSession } from '@/_types';
import { buildPerformedSession, generateID } from '@/lib';
import WorkoutTrackingModal from '@/app/components/WorkoutTrackingModal';

import styles from "./page.module.scss";
import ByDate from './_components/ByDate';
import ByExercise from './_components/ByExercise';
import SelectField from '@/app/components/forms/SelectField';

type Props = {}

type ViewMode = "byDate" | "byExercise";
export type TrackedWorkoutExercise = WorkoutExercise & { id: number };

export default function page({ }: Props) {
    let { workoutId } = useParams<{ workoutId: string }>();
    const { workouts } = useWorkoutsContext();
    const { performedSessions, setPerformedSessions } = usePerformedSessionsContext();
    const { plannedSessions } = usePlannedSessionsContext();
    const [viewMode, setViewMode] = useState<ViewMode>("byDate");
    const [newSession, setNewSession] = useState<PerformedSession | null>(null);
    const [sessionFormSource, setSessionFormSource] = useState<SessionFormSource>("none");
    const workout = workouts.find(w => w.id === Number(workoutId));
    const { exercises } = useExercisesContext();

    let workoutExercises: TrackedWorkoutExercise[] = [];
    if (workout) {
        workoutExercises = getTrackedWorkoutExercises(workout, performedSessions);
    }
    const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(
        workoutExercises[0]?.id ?? null
    );

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
    function getTrackedWorkoutExercises(workout: Workout, sessions: PerformedSession[]): TrackedWorkoutExercise[] {
        const usedIds = new Set(
            sessions.flatMap(session => session.performedExercises.map(pe => pe.workoutExerciseId))
        );
        return workout.workoutExercises.filter(
            (we): we is TrackedWorkoutExercise => we.id !== null && usedIds.has(we.id)
        );
    }

    function getExerciseSelectLabel(
        workoutExercise: WorkoutExercise,
        workout: Workout,
        exercises: Exercise[]
    ): string {
        const exercise = exercises.find(e => e.id === workoutExercise.exerciseId);
        const sameNameEntries = workout.workoutExercises
            .filter(we => we.exerciseId === workoutExercise.exerciseId);
        if (sameNameEntries.length <= 1) {
            return exercise?.name ?? "Unknown";
        }
        const position = sameNameEntries.findIndex(we => we.id === workoutExercise.id) + 1;
        return `${exercise?.name} (${position})`;
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
                        {
                            workout && viewMode == "byExercise"
                            && selectedExerciseId !== null &&
                            <div className={styles.exerciseSelect}>
                                <SelectField
                                    label=""
                                    name="exercise"
                                    parseValue={Number}
                                    value={selectedExerciseId}
                                    options={workoutExercises.map(ex => ex.id)}
                                    optionsNames={workoutExercises.map(ex => getExerciseSelectLabel(ex, workout, exercises))}
                                    onChange={(id: number) => setSelectedExerciseId(id)}
                                />
                            </div>
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
                                            selectedExerciseId={selectedExerciseId}
                                            workoutExercises={workoutExercises}
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
                            workoutName={workout?.name ?? ""}
                            plannedSessions={plannedSessions}
                            performedSessions={workoutPerformedSessions}
                            submitText="Save Progress"
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
