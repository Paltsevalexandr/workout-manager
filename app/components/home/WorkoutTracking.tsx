"use client";

import React, {
    useState,
    type SubmitEvent
} from 'react';
import styles from "../../page.module.scss";
import { useExercisesContext, usePerformedSessionsContext, usePlannedSessionsContext, useWorkoutsContext } from '@/app/providers';
import WorkoutsList from "./WorkoutList";
import { ModalType, PerformedExercise, PlannedExercise, SessionFormSource, Workout, WorkoutExercise, PlannedSession, PerformedSession } from '@/_types';
import WorkoutTrackingModal from '../WorkoutTrackingModal';
import {
    buildPerformedSession,
    buildPlannedSession,
    generateID,
} from '@/lib';
import WorkoutDetails from './WorkoutDetails';
import WorkoutForm from './WorkoutForm';
import { MenuItem } from '../ui/KebabMenu';

type Props = {}

export default function WorkoutTracking({ }: Props) {
    const { workouts, setWorkouts } = useWorkoutsContext();
    const { exercises, setExercises } = useExercisesContext();

    const [workoutToEdit, setWorkoutToEdit] = useState<Workout | null>(null);
    const [workoutName, setWorkoutName] = useState<string>("");
    const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([
        { id: null, workoutTemplateId: null, exerciseId: exercises[0].id }
    ]);
    const [isCreateWorkoutFormOpen, setIsCreateWorkoutFormOpen] = useState(false);
    const [isEditWorkoutFormOpen, setIsEditWorkoutFormOpen] = useState(false);

    const { performedSessions, setPerformedSessions } = usePerformedSessionsContext();
    const { plannedSessions, setPlannedSessions } = usePlannedSessionsContext();
    const [modalType, setModalType] = useState<ModalType>("none");
    const [performedSession, setPerformedSession] = useState<PerformedSession | null>(null);
    const [plannedSession, setPlannedSession] = useState<PlannedSession | null>(null);
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
    const [sessionFormSource, setSessionFormSource] = useState<SessionFormSource>("none");

    function createWorkout(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        // TODO - send to server new workout and get the ID
        const newWorkoutId = generateID(workouts);
        const allWorkoutExercises: WorkoutExercise[] = workouts.flatMap(w => w.workoutExercises);

        const newWorkoutExercises: WorkoutExercise[] = workoutExercises.map((we, i) => ({
            id: generateID(allWorkoutExercises) + i,
            workoutTemplateId: newWorkoutId,
            exerciseId: we.exerciseId,
        }));

        setWorkouts((currentWorkouts) => [
            ...currentWorkouts,
            {
                id: newWorkoutId,
                name: workoutName,
                workoutExercises: newWorkoutExercises,
            },
        ]);
        setWorkoutExercises([
            { id: null, workoutTemplateId: null, exerciseId: exercises[0]?.id ?? -1 }
        ]);
        setWorkoutName("");
        setIsCreateWorkoutFormOpen(false);
    }

    function editWorkout(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        // TODO - send to server
        setWorkouts((currentWorkouts) => {
            return currentWorkouts.map((workout) => {
                if (workoutToEdit?.id !== workout.id) {
                    return workout;
                }

                const allWorkoutExercises: WorkoutExercise[] = currentWorkouts.flatMap(w => w.workoutExercises);

                const updatedWorkoutExercises: WorkoutExercise[] = workoutExercises.map((we) => {
                    if (we.id !== null) {
                        return { ...we, workoutTemplateId: workout.id };
                    }
                    return {
                        id: generateID(allWorkoutExercises),
                        workoutTemplateId: workout.id,
                        exerciseId: we.exerciseId,
                    };
                });

                return {
                    id: workout.id,
                    name: workoutName,
                    workoutExercises: updatedWorkoutExercises,
                };
            });
        });
        setWorkoutToEdit(null);
        setWorkoutExercises([
            { id: null, workoutTemplateId: null, exerciseId: exercises[0]?.id ?? -1 }
        ]);
        setWorkoutName("");
        setIsEditWorkoutFormOpen(false);
    }

    function handleCancelForm() {
        setWorkoutExercises([
            { id: null, workoutTemplateId: null, exerciseId: exercises[0]?.id ?? -1 }
        ]);
        setWorkoutName("");
        setIsCreateWorkoutFormOpen(false);
        setIsEditWorkoutFormOpen(false);
        setWorkoutToEdit(null);
    }

    function handleEdit(workout: Workout) {
        setWorkoutToEdit(workout);
        setWorkoutName(workout.name);
        setWorkoutExercises([...workout.workoutExercises]);
        setIsEditWorkoutFormOpen(true);
    }

    function toggleSessionFormSource(source: SessionFormSource, workoutId: number) {
        if (source === sessionFormSource) return;
        switch (modalType) {
            case "session":
                savePerformedSession(workoutId, source);
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
    function savePerformedSession(workoutId: number, source?: SessionFormSource) {
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
            setPerformedSessions(prevSessions => [
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
            setPerformedSession((prevSession): PerformedSession | null => {
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
            setPlannedSession((prevSession): PlannedSession | null => {
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
    function getSession(): PerformedSession | PlannedSession | null {
        switch (modalType) {
            case "plan":
                return plannedSession;
            case "session":
                return performedSession;
            default:
                return null;
        }
    }

    function getMenuItems(workout: Workout | null): MenuItem[] {
        return [
            {
                label: "Plan Next Session",
                onClick: () => workout ? createNextSessionPlan(workout.id) : null
            },
            {
                label: "History",
                href: workout ? `/workouts/${workout.id}/history` : "#"
            },
            {
                label: "Edit",
                onClick: () => workout ? handleEdit(workout) : null
            },
            {
                label: "Archive",
                onClick: () => { }
            }
        ]
    }

    const session: PerformedSession | PlannedSession | null = getSession();
    return (
        <main>
            <section>
                <div className="section-content">
                    <div className={styles.workoutColumns}>
                        <WorkoutsList
                            selectedWorkout={selectedWorkout}
                            performedSessions={performedSessions}
                            plannedSessions={plannedSessions}
                            savePerformedSession={savePerformedSession}
                            setSelectedWorkout={setSelectedWorkout}
                            openCreateWorkoutModal={() => setIsCreateWorkoutFormOpen(true)}
                        />
                        {
                            selectedWorkout &&
                            <WorkoutDetails
                                workout={selectedWorkout}
                                performedSessions={performedSessions}
                                menuItems={getMenuItems(selectedWorkout)}
                                savePerformedSession={savePerformedSession}
                                createNextSessionPlan={createNextSessionPlan}
                            />
                        }
                    </div>
                    {
                        modalType != "none" && session
                        && <WorkoutTrackingModal
                            modalType={modalType}
                            performedSessions={performedSessions}
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
                    {
                        isCreateWorkoutFormOpen &&
                        <WorkoutForm
                            exercises={exercises}
                            workoutName={workoutName}
                            handleCancelForm={handleCancelForm}
                            handleSubmit={createWorkout}
                            setWorkoutName={setWorkoutName}
                            workoutExercises={workoutExercises}
                            setWorkoutExercises={setWorkoutExercises}
                        />
                    }
                    {
                        isEditWorkoutFormOpen &&
                        <WorkoutForm
                            exercises={exercises}
                            editWorkout={workoutToEdit}
                            workoutName={workoutName}
                            handleCancelForm={handleCancelForm}
                            handleSubmit={editWorkout}
                            setWorkoutName={setWorkoutName}
                            workoutExercises={workoutExercises}
                            setWorkoutExercises={setWorkoutExercises}
                        />
                    }
                </div>
            </section>
        </main>
    )
}
