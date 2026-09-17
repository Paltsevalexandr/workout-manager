"use client";

import { useState } from 'react';
import Content from '@/app/components/layout/Content';
import { usePerformedSessionsContext, useWorkoutsContext } from '@/app/providers';
import { useParams } from 'next/navigation';

import styles from "./page.module.scss";
import PeformedSession from './_components/PeformedSession';


type Props = {}

export default function page({ }: Props) {
    let { workoutId } = useParams<{ workoutId: string }>();
    const { workouts } = useWorkoutsContext();
    const { performedSessions } = usePerformedSessionsContext();
    const [expandedSessions, setExpandedSessions] = useState<number[]>([1]);
    const workout = workouts.find(w => w.id === Number(workoutId));

    if (!workout) {
        return <p>Workout not found</p>;
    }

    function toggleSessionDropdown(id: number) {
        if (expandedSessions.includes(id)) {
            setExpandedSessions(prev => prev.filter(i => i != id));
        }
        else {
            setExpandedSessions(prev => [...prev, id]);
        }
    }

    const workoutPerformedSessions = performedSessions
        .filter(session => session.workoutId == workout.id)
        .sort((a, b) => b.date - a.date);
    return (
        <Content title={`${workout.name} History`}>
            <section>
                <div className="section-content">
                    <div>
                        <div className={styles.performedSessionListWrap}>
                            <ul className={styles.performedSessionList}>
                                {
                                    workoutPerformedSessions.map(session => {
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
                    </div>
                </div>
            </section>

        </Content>
    )
}
