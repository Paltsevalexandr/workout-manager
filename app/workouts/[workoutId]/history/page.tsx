"use client";

import { useState } from 'react';
import Content from '@/app/components/layout/Content';
import { usePerformedSessionsContext, useWorkoutsContext } from '@/app/providers';
import { useParams } from 'next/navigation';

import styles from "./page.module.scss";
import ByDate from './_components/ByDate';
import ByExercise from './_components/ByExercise';


type Props = {}

type ViewMode = "byDate" | "byExercise";

export default function page({ }: Props) {
    let { workoutId } = useParams<{ workoutId: string }>();
    const { workouts } = useWorkoutsContext();
    const { performedSessions } = usePerformedSessionsContext();
    const [viewMode, setViewMode] = useState<ViewMode>("byExercise");
    const workout = workouts.find(w => w.id === Number(workoutId));

    if (!workout) {
        return <p>Workout not found</p>;
    }

    const workoutPerformedSessions = performedSessions
        .filter(session => session.workoutId == workout.id);

    return (
        <Content title={`${workout.name} History`}>
            <section>
                <div className="section-content">
                    <div>
                        <div className={styles.controls}>
                            <button
                                className={`${styles.controlsBtn} button-secondary ${viewMode == "byDate" ? styles.active : ""}`}
                                onClick={() => setViewMode("byDate")}
                            >
                                By Date
                            </button>
                            <button
                                className={`${styles.controlsBtn} button-secondary ${viewMode == "byExercise" ? styles.active : ""}`}
                                onClick={() => setViewMode("byExercise")}
                            >
                                By Exercise
                            </button>
                        </div>
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
                    </div>
                </div>
            </section>

        </Content>
    )
}
