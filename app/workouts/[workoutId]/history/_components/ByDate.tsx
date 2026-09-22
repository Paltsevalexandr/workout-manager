import { useState, type SubmitEvent } from 'react'
import { PerformedExercise, Workout, PerformedSession } from '@/_types';
import { generateID } from '@/lib';
import styles from "./ByDate.module.scss";
import PeformedSession from './PeformedSession';
import Modal from '@/app/components/ui/Modal';
import ModalForm from '@/app/components/ui/ModalForm';
import WorkoutTrackingModal from '@/app/components/WorkoutTrackingModal';
import { usePerformedSessionsContext } from '@/app/providers';

type Props = {
    workout: Workout;
    performedSessions: PerformedSession[];
}

export default function ByDate({
    workout,
    performedSessions
}: Props) {
    const [expandedSessions, setExpandedSessions] = useState<number[]>([1]);
    const { setPerformedSessions } = usePerformedSessionsContext();
    const [deleteSession, setDeleteSession] = useState<PerformedSession | null>(null);
    const [editSession, setEditSession] = useState<PerformedSession | null>(null);
    const [duplicateSession, setDuplicateSession] = useState<PerformedSession | null>(null);
    const sortedPerformedSessions = performedSessions.sort((a, b) => b.date - a.date);

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

    function handlePerformedExerciseChange(value: number, workoutExerciseId: number, field: keyof PerformedExercise) {
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
        setPerformedSessions(prev => prev.map(s => s.id === editSession.id ? editSession : s));
        setEditSession(null);
    }

    function duplicateSessionForCreating(session: PerformedSession) {
        const performedExerciseIds = performedSessions.flatMap(
            currentSession => currentSession.performedExercises
        );
        const firstExerciseId = generateID(performedExerciseIds);
        setDuplicateSession({
            ...session,
            id: null,
            date: Date.now(),
            performedExercises: session.performedExercises.map((performedExercise, index) => ({
                ...performedExercise,
                id: firstExerciseId + index,
            })),
        });
    }

    function setDuplicateSessionDate(date: number) {
        setDuplicateSession(prev => prev ? { ...prev, date } : prev);
    }

    function handleDuplicateExerciseChange(
        value: number,
        workoutExerciseId: number,
        field: keyof PerformedExercise
    ) {
        setDuplicateSession(prev => {
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

    function saveDuplicateSession(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!duplicateSession) return;
        setPerformedSessions(prev => [
            ...prev,
            { ...duplicateSession, id: generateID(prev) }
        ]);
        setDuplicateSession(null);
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
                            <PeformedSession
                                key={`session_${session.id}`}
                                workout={workout}
                                session={session}
                                showDeleteModal={() => setDeleteSession(session)}
                                showEditModal={() => setEditSession(session)}
                                showDuplicateModal={() => duplicateSessionForCreating(session)}
                                isExpanded={expandedSessions.includes(session.id!)}
                                toggleSessionDropdown={() => toggleSessionDropdown(session.id!)}
                            />
                        )
                    })
                }
            </ul>
            {
                deleteSession &&
                <Modal
                    onClose={() => setDeleteSession(null)}>
                    <ModalForm
                        title="Delete Session?"
                        submitText="Confirm"
                        onSubmit={(event) => {
                            event.preventDefault();
                            setPerformedSessions(prev => prev.filter(s => s.id != deleteSession.id));
                            setDeleteSession(null);
                        }}
                        onCancel={() => setDeleteSession(null)}
                    >
                        <p>Are you sure you want to delete session from { }?</p>
                    </ModalForm>
                </Modal>
            }
            {
                editSession &&
                <WorkoutTrackingModal
                    modalType="session"
                    session={editSession}
                    sessionFormSource="none"
                    plannedSessions={[]}
                    performedSessions={performedSessions}
                    saveSession={saveEditSession}
                    cancelForm={() => setEditSession(null)}
                    setDate={setEditSessionDate}
                    handlePerformedExerciseChange={handlePerformedExerciseChange}
                />
            }
            {
                duplicateSession &&
                <WorkoutTrackingModal
                    modalType="session"
                    session={duplicateSession}
                    sessionFormSource="none"
                    plannedSessions={[]}
                    performedSessions={performedSessions}
                    saveSession={saveDuplicateSession}
                    cancelForm={() => setDuplicateSession(null)}
                    setDate={setDuplicateSessionDate}
                    handlePerformedExerciseChange={handleDuplicateExerciseChange}
                />
            }
        </>
    )
}
