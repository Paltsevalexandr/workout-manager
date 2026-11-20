"use client";

import {
    useState,
    type SubmitEvent
} from "react";
import styles from "../page.module.scss";
import {
    useExercisesContext, usePerformedSessionsContext,
    usePlannedSessionsContext, useWorkoutsContext
} from "@/app/providers";
import WorkoutsList from "./WorkoutsList";
import {
    ModalType, SessionFormSource,
    WorkoutExerciseDraft, Workout,
    PlannedSessionDraft,
    PerformedSessionDraft,
    SessionExerciseDraft
} from "@/_types";
import WorkoutTrackingModal from "../components/workout/WorkoutTrackingModal";
import {
    buildPerformedSession,
    buildPlannedSession,
    getLastPlan,
} from "@/lib";
import WorkoutDetails from "./WorkoutDetails";
import WorkoutForm from "./WorkoutForm";
import { MenuItem } from "../components/ui/KebabMenu";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { archiveWorkoutAction, createWorkoutAction, softDeleteWorkoutAction, updateWorkoutAction } from "./actions";
import { createPerformedSessionAction, createPlannedSessionAction, updatePlannedSessionAction } from "../sessions/actions";
import { useServerAction } from "@/hooks/useServerAction";

export default function WorkoutTracking() {
    
    const { runServerAction, resetError, error, isPending } = useServerAction();
    const { workouts } = useWorkoutsContext();
    const { exercises } = useExercisesContext();

    const [workoutToEdit, setWorkoutToEdit] = useState<Workout | null>(null);
    const [workoutName, setWorkoutName] = useState<string>("");
    // A new form starts with one row preselected to the first active exercise
    // (exerciseId 0 means "not selected" when the catalog is empty)
    function createDefaultWorkoutExercise(): WorkoutExerciseDraft {
        return {
            id: null,
            exerciseId: exercises.find(e => !e.isDeleted)?.id ?? 0,
        };
    }
    const [workoutExercises, setWorkoutExercises] = useState<WorkoutExerciseDraft[]>(() => [createDefaultWorkoutExercise()]);
    const [isCreateWorkoutFormOpen, setIsCreateWorkoutFormOpen] = useState(false);
    const [isEditWorkoutFormOpen, setIsEditWorkoutFormOpen] = useState(false);

    const { performedSessions } = usePerformedSessionsContext();
    const { plannedSessions } = usePlannedSessionsContext();
    const [modalType, setModalType] = useState<ModalType>("none");
    const [selectedWorkoutName, setSelectedWorkoutName] = useState<string>("");
    const [performedSessionDraft, setPerformedSessionDraft] = useState<PerformedSessionDraft | null>(null);
    const [plannedSessionDraft, setPlannedSessionDraft] = useState<PlannedSessionDraft | null>(null);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(null);
    const selectedWorkout = workouts.find(workout => workout.id === selectedWorkoutId) ?? null;
    const [sessionFormSource, setSessionFormSource] = useState<SessionFormSource>("none");
    const [deleteWorkoutId, setDeleteWorkoutId] = useState<number | null>(null);
    const [archiveWorkoutId, setArchiveWorkoutId] = useState<number | null>(null);
    const [showWorkoutValidation, setShowWorkoutValidation] = useState(false);

    // exerciseId !== 0 catches an unselected row; the exercises.some(...) check catches
    // a row whose exercise was deleted from the catalog (exerciseId no longer resolves,
    // or now resolves to a soft-deleted exercise) AFTER exercise was selected in the form
    const isWorkoutExercisesValid = workoutExercises.length > 0
        && workoutExercises.every((we) => we.exerciseId !== 0 && exercises.some(e => e.id === we.exerciseId && !e.isDeleted));
    const workoutExercisesError = !showWorkoutValidation
        ? undefined
        : workoutExercises.length === 0
            ? "Add at least one exercise"
            : !isWorkoutExercisesValid
                ? "Select an exercise for every row"
                : undefined;

    // Names are compared case-insensitively; archived workouts count too.
    const normalizedWorkoutName = workoutName.trim().toLowerCase();
    const workoutWithSameName = workouts.find(
        w => w.id !== workoutToEdit?.id && w.name.trim().toLowerCase() === normalizedWorkoutName
    );
    const isWorkoutNameTaken = workoutWithSameName !== undefined;
    // TODO - link to the archive once it's shown in the UI
    const workoutNameError = !showWorkoutValidation || !workoutWithSameName
        ? undefined
        : workoutWithSameName.archivedAt !== null
            ? "A workout with this name already exists in the archive"
            : "A workout with this name already exists";

    function createWorkout(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setShowWorkoutValidation(false);
        if (!isWorkoutExercisesValid || isWorkoutNameTaken) {
            setShowWorkoutValidation(true);
            return;
        }

        const newWorkoutExercises: WorkoutExerciseDraft[] = workoutExercises.map((we) => ({
            id: null,
            exerciseId: we.exerciseId,
        }));

        runServerAction({
            action: () => createWorkoutAction({
                name: workoutName.trim(),
                workoutExercises: newWorkoutExercises,
            }),
            onSuccess: closeDialogs
        });
    }

    function editWorkout(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setShowWorkoutValidation(false);
        if (!isWorkoutExercisesValid || isWorkoutNameTaken) {
            setShowWorkoutValidation(true);
            return;
        }

        runServerAction({
            action: () => updateWorkoutAction(workoutToEdit?.id, {
                name: workoutName.trim(),
                workoutExercises: workoutExercises.map(we => {
                    const original = workoutToEdit?.workoutExercises.find(originalWe => originalWe.id === we.id);
                    // keep the id only if the row still has the same exercise,
                    // a swapped exercise becomes a new row
                    return {
                        id: original?.exerciseId === we.exerciseId ? we.id : null,
                        exerciseId: we.exerciseId,
                    };
                })
            }),
            onSuccess: closeDialogs
        });
    }

    function closeDialogs() {
        resetError();
        setWorkoutExercises([createDefaultWorkoutExercise()]);
        setWorkoutName("");
        setShowWorkoutValidation(false);
        setIsCreateWorkoutFormOpen(false);
        setIsEditWorkoutFormOpen(false);
        setWorkoutToEdit(null);
        setDeleteWorkoutId(null);
        setArchiveWorkoutId(null);
    }

    function cancelForm() {
        resetError();
        setModalType("none");
        setSessionFormSource("none");
        setPerformedSessionDraft(null);
        setPlannedSessionDraft(null);
        setSelectedWorkoutName("");
    }

    function handleWorkoutEdit(workout: Workout | null) {
        if (!workout) {
            return;
        }
        setWorkoutToEdit(workout);
        setWorkoutName(workout.name);
        setWorkoutExercises(workout.workoutExercises.map(we => ({ id: we.id, exerciseId: we.exerciseId })));
        setIsEditWorkoutFormOpen(true);
    }

    function toggleSessionFormSource(source: SessionFormSource, workoutId: number) {
        if (source === sessionFormSource) return;
        switch (modalType) {
            case "session":
                openPerformedSessionForm(workoutId, source);
                break;
        }
    }

    function createNextSessionPlan(workout: Workout | null) {
        if (!workout) return;

        // plan is the existing one rebuilt against the current workout, or a new one
        const { plan, sessionFormSource } = buildPlannedSession(workout, performedSessions, plannedSessions, exercises);
        setSessionFormSource(sessionFormSource);
        setPlannedSessionDraft(plan);
        setModalType("plan");
        setSelectedWorkoutName(workout.name);
    }

    function openPerformedSessionForm(workoutId: number, source?: SessionFormSource) {
        const workout = getWorkout(workoutId);
        if (!workout) return;

        const { session, sessionFormSource } = buildPerformedSession(
            workout, performedSessions, plannedSessions, exercises,
            { source, date: performedSessionDraft?.date }
        );
        setSessionFormSource(sessionFormSource);
        setPerformedSessionDraft(session);
        setModalType("session");
        setSelectedWorkoutName(workout.name);
    }

    function getWorkout(workoutId: number): Workout | null {
        return workouts.find(workout => workout.id == workoutId) ?? null;
    }

    function createSession(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (modalType == "plan" && plannedSessionDraft) {
            const existing = plannedSessions.find(
                plan => plan.workoutId == plannedSessionDraft.workoutId
            );
            runServerAction({
                action: () => {
                    return existing
                        ? updatePlannedSessionAction(existing.id, plannedSessionDraft)
                        : createPlannedSessionAction(plannedSessionDraft);
                },
                onSuccess: cancelForm
            })

        }
        else if (modalType == "session" && performedSessionDraft) {
            runServerAction({
                action: () => createPerformedSessionAction(performedSessionDraft),
                onSuccess: cancelForm
            });
        }
    }

    function setDate(date: number) {
        if (modalType == "session") {
            setPerformedSessionDraft((prevSession): PerformedSessionDraft | null => {
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
            setPlannedSessionDraft((prevSession): PlannedSessionDraft | null => {
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
    function handleSessionExerciseChange(
        value: number,
        workoutExerciseId: number,
        field: keyof SessionExerciseDraft
    ) {
        if (modalType == "session") {
            setPerformedSessionDraft(prevSession => {
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
            setPlannedSessionDraft(prevSession => {
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
    function getSession(): PerformedSessionDraft | PlannedSessionDraft | null {
        switch (modalType) {
            case "plan":
                return plannedSessionDraft;
            case "session":
                return performedSessionDraft;
            default:
                return null;
        }
    }
    function deleteWorkout(workout: Workout | null) {
        setDeleteWorkoutId(workout?.id ?? null);
    }
    function handleDeleteWorkout() {
        runServerAction({
            action: () => softDeleteWorkoutAction(deleteWorkoutId),
            onSuccess: closeDialogs
        });
    }
    function archiveWorkout(workout: Workout | null) {
        setArchiveWorkoutId(workout?.id ?? null);
    }
    function handleArchiveWorkout() {
        runServerAction({
            action: () => archiveWorkoutAction(archiveWorkoutId),
            onSuccess: () => {
                setSelectedWorkoutId(null);
                setArchiveWorkoutId(null);
            }
        });
    }

    function getMenuItems(workout: Workout | null): MenuItem[] {
        return [
            {
                label: workout && getLastPlan(workout.id, plannedSessions) ? "Edit Plan" : "Plan Next Session",
                onClick: () => createNextSessionPlan(workout)
            },
            {
                label: "History",
                href: workout ? `/workouts/${workout.id}/history` : "#"
            },
            {
                label: "Edit",
                onClick: () => handleWorkoutEdit(workout)
            },
            {
                label: "Archive",
                onClick: () => archiveWorkout(workout)
            },
            {
                label: "Delete",
                onClick: () => deleteWorkout(workout)
            }
        ]
    }

    const session: PerformedSessionDraft | PlannedSessionDraft | null = getSession();
    return (
        <main>
            <section>
                <div className="section-content">
                    <div className={styles.workoutColumns}>
                        <WorkoutsList
                            selectedWorkout={selectedWorkout}
                            performedSessions={performedSessions}
                            plannedSessions={plannedSessions}
                            openPerformedSessionForm={openPerformedSessionForm}
                            setSelectedWorkout={(workout) => setSelectedWorkoutId(workout.id)}
                            openCreateWorkoutModal={() => setIsCreateWorkoutFormOpen(true)}
                        />
                        {
                            selectedWorkout &&
                            <WorkoutDetails
                                // remount on workout switch, so the source toggle state
                                // left over from the previous workout is reset
                                key={selectedWorkout.id}
                                workout={selectedWorkout}
                                performedSessions={performedSessions}
                                menuItems={getMenuItems(selectedWorkout)}
                                openPerformedSessionForm={openPerformedSessionForm}
                            />
                        }
                    </div>
                    {
                        modalType != "none" && session
                        && <WorkoutTrackingModal
                            modalType={modalType}
                            workoutName={selectedWorkoutName}
                            performedSessions={performedSessions}
                            plannedSessions={plannedSessions}
                            submitText={modalType == "plan" ? "Save Plan" : "Save Progress"}
                            setDate={setDate}
                            sessionFormSource={sessionFormSource}
                            session={session}
                            error={error}
                            submitDisabled={isPending}
                            saveSession={createSession}
                            cancelForm={cancelForm}
                            toggleSessionFormSource={toggleSessionFormSource}
                            handleSessionExerciseChange={handleSessionExerciseChange}
                        />
                    }
                    {
                        isCreateWorkoutFormOpen &&
                        <WorkoutForm
                            exercises={exercises}
                            submitDisabled={isPending}
                            workoutName={workoutName}
                            handleCancelForm={closeDialogs}
                            handleSubmit={createWorkout}
                            setWorkoutName={setWorkoutName}
                            workoutExercises={workoutExercises}
                            setWorkoutExercises={setWorkoutExercises}
                            workoutExercisesError={workoutExercisesError}
                            workoutNameError={workoutNameError}
                            workoutError={error}
                        />
                    }
                    {
                        isEditWorkoutFormOpen &&
                        <WorkoutForm
                            exercises={exercises}
                            submitDisabled={isPending}
                            editWorkout={workoutToEdit}
                            workoutName={workoutName}
                            handleCancelForm={closeDialogs}
                            handleSubmit={editWorkout}
                            setWorkoutName={setWorkoutName}
                            workoutExercises={workoutExercises}
                            setWorkoutExercises={setWorkoutExercises}
                            workoutExercisesError={workoutExercisesError}
                            workoutNameError={workoutNameError}
                            workoutError={error}
                        />
                    }
                    {deleteWorkoutId !== null && (
                        <ConfirmDialog
                            title="Delete Workout?"
                            error={error}
                            confirmDisabled={isPending}
                            onConfirm={handleDeleteWorkout}
                            onCancel={closeDialogs}
                        >
                            <p>Are you sure you want to delete &quot;{workouts.find((workout) => workout.id === deleteWorkoutId)?.name}&quot;?</p>
                        </ConfirmDialog>
                    )}
                    {archiveWorkoutId !== null && (
                        <ConfirmDialog
                            title="Archive Workout?"
                            error={error}
                            confirmDisabled={isPending}
                            onConfirm={handleArchiveWorkout}
                            onCancel={closeDialogs}
                        >
                            <p>Are you sure you want to archive &quot;{workouts.find((workout) => workout.id === archiveWorkoutId)?.name}&quot;?</p>
                        </ConfirmDialog>
                    )}
                </div>
            </section>
        </main>
    )
}
