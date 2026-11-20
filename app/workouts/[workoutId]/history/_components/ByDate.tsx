import { Dispatch, SetStateAction, useState, type SubmitEvent } from "react"
import { Workout, PerformedSession, PerformedSessionDraft, SessionExerciseDraft } from "@/_types";
import { createSessionExercises, formatFullDate, getLastSession } from "@/lib";
import styles from "./ByDate.module.scss";
import PerformedSessionItem from "./PerformedSessionItem";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";
import WorkoutTrackingModal from "@/app/components/workout/WorkoutTrackingModal";
import { useExercisesContext } from "@/app/providers";
import { useServerAction } from "@/hooks/useServerAction";
import { deletePerformedSessionAction, updatePerformedSessionAction } from "@/app/sessions/actions";

type Props = {
    workout: Workout;
    performedSessions: PerformedSession[];
    setNewSession: Dispatch<SetStateAction<PerformedSessionDraft | null>>
}

export default function ByDate({
    workout,
    performedSessions,
    setNewSession,
}: Props) {
    const { runServerAction, resetError, isPending, error } = useServerAction();
    const [expandedSessions, setExpandedSessions] = useState<number[]>(() => {
        const lastSession = getLastSession(workout.id, performedSessions);
        return lastSession !== null ? [lastSession.id] : []
    });
    const { exercises } = useExercisesContext();
    const [deleteSession, setDeleteSession] = useState<PerformedSession | null>(null);
    const [editSession, setEditSession] = useState<PerformedSession | null>(null);
    const sortedPerformedSessions = [...performedSessions].sort((a, b) => b.date - a.date);

    function toggleSessionDropdown(id: number) {
        if (expandedSessions.includes(id)) {
            setExpandedSessions(prev => prev.filter(i => i != id));
        }
        else {
            setExpandedSessions(prev => [...prev, id]);
        }
    }

    function setEditSessionDate(date: number) {
        setEditSession(prev => prev ? { ...prev, date } : prev);
    }

    function handlePerformedExerciseChange(value: number, workoutExerciseId: number, field: keyof SessionExerciseDraft) {
        setEditSession(prev => {
            if (!prev) {
                return prev;
            }
            return {
                ...prev,
                performedExercises: prev.performedExercises.map(ex =>
                    ex.workoutExerciseId === workoutExerciseId ? { ...ex, [field]: value } : ex
                )
            };
        });
    }

    function saveEditSession(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!editSession) return;

        runServerAction({
            action: () => updatePerformedSessionAction(editSession.id, editSession),
            onSuccess: () => setEditSession(null)
        });
    }

    function duplicateSessionForCreating(session: PerformedSession) {
        setNewSession({
            workoutId: session.workoutId,
            // False positive: this runs in a click handler ("Duplicate as New"), not during render, so next line tells ESlint to ignore the "issue"
            // eslint-disable-next-line react-hooks/purity
            date: Date.now(),
            // rows come from the workout's currently active exercises,
            // the picked session only supplies the values (sets/target/weight/rest)
            performedExercises: createSessionExercises(workout, session, exercises),
        })
    }

    const sessionsAmount = sortedPerformedSessions.length;
    return (
        <>
            {
                <p className={styles.performedSessionsAmount}>
                    {`${sessionsAmount} ${sessionsAmount > 1 ? "sessions" : "session"} logged`}
                </p>
            }
            <ul className={styles.performedSessionList}>
                {
                    sortedPerformedSessions.map(session => {
                        return (
                            <PerformedSessionItem
                                key={`session_${session.id}`}
                                session={session}
                                showDeleteModal={() => setDeleteSession(session)}
                                showEditModal={() => setEditSession(session)}
                                showDuplicateModal={() => duplicateSessionForCreating(session)}
                                isExpanded={expandedSessions.includes(session.id)}
                                toggleSessionDropdown={() => toggleSessionDropdown(session.id)}
                            />
                        )
                    })
                }
            </ul>
            {
                deleteSession &&
                <ConfirmDialog
                    title="Delete Session?"
                    error={error}
                    confirmDisabled={isPending}
                    onConfirm={() => {
                        runServerAction({
                            action: () => deletePerformedSessionAction(deleteSession.id),
                            onSuccess: () => setDeleteSession(null)
                        });
                    }}
                    onCancel={() => {
                        resetError();
                        setDeleteSession(null);
                    }}
                >
                    <p>Are you sure you want to delete session from {formatFullDate(deleteSession.date, true)}?</p>
                </ConfirmDialog>
            }
            {
                editSession &&
                <WorkoutTrackingModal
                    modalType="session"
                    session={editSession}
                    sessionFormSource="none"
                    workoutName={workout.name}
                    plannedSessions={[]}
                    performedSessions={performedSessions}
                    submitText="Save Progress"
                    submitDisabled={isPending}
                    error={error}
                    saveSession={saveEditSession}
                    cancelForm={() => {
                        resetError();
                        setEditSession(null);
                    }}
                    setDate={setEditSessionDate}
                    handleSessionExerciseChange={handlePerformedExerciseChange}
                />
            }
        </>
    )
}
