import { useState } from 'react'
import { Workout, WorkoutSession } from '@/_types';
import styles from "../page.module.scss";
import PeformedSession from './PeformedSession';

type Props = {
    workout: Workout;
    performedSessions: WorkoutSession[];
}

export default function ByDate({
    workout,
    performedSessions
}: Props) {
    const [expandedSessions, setExpandedSessions] = useState<number[]>([1]);
    const sortedPerformedSessions = performedSessions.sort((a, b) => b.date - a.date);

    function toggleSessionDropdown(id: number) {
        if (expandedSessions.includes(id)) {
            setExpandedSessions(prev => prev.filter(i => i != id));
        }
        else {
            setExpandedSessions(prev => [...prev, id]);
        }
    }
    return (
        <div className={styles.performedSessionListWrap}>
            <ul className={styles.performedSessionList}>
                {
                    sortedPerformedSessions.map(session => {
                        return (
                            <PeformedSession
                                key={`session_${session.id}`}
                                workout={workout}
                                session={session}
                                isExpanded={expandedSessions.includes(session.id!)}
                                toggleSessionDropdown={() => toggleSessionDropdown(session.id!)}
                            />
                        )
                    })
                }
            </ul>
        </div>
    )
}
