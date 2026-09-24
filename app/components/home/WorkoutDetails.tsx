import styles from "../../page.module.scss";
import { Workout, PerformedSession } from '@/_types';
import ExerciseList from './ExerciseList';
import { formatRelativeDate, getExercisesLabel, getLastPlan, getLastSession, getLastSessionDate, getStatusClass } from '@/lib';
import KebabMenu, { MenuItem } from '../ui/KebabMenu';
import { ListChecks } from "lucide-react";
import { usePlannedSessionsContext } from "@/app/providers";
import { useEffect, useState } from "react";

type Props = {
    workout: Workout;
    performedSessions: PerformedSession[];
    savePerformedSession: (workoutId: number) => void;
    createNextSessionPlan: (workoutId: number) => void;
    menuItems: MenuItem[];
}

export default function WorkoutDetails({
    workout,
    performedSessions,
    menuItems,
    savePerformedSession,
}: Props) {
    type ViewMode = "session" | "plan" | null;
    const { plannedSessions } = usePlannedSessionsContext();
    const lastSession = getLastSession(workout.id, performedSessions);
    const lastPlan = getLastPlan(workout.id, plannedSessions)
    const lastSessionDate = getLastSessionDate(workout.id, performedSessions);
    const lastSessionClass = getStatusClass(lastSessionDate, styles);
    const lastRelativeDate: string = formatRelativeDate(lastSessionDate);

    // null = no explicit user choice yet, fall back to the default source (session takes priority over plan)
    const [viewMode, setViewMode] = useState<ViewMode>(null);

    useEffect(() => {
        // reset the manual choice when switching to a different workout,
        // otherwise a "session"/"plan" viewMode left over from the previous
        // workout could point at a source the new workout doesn't even have
        setViewMode(null);
    }, [workout.id]);

    // if the manually selected source disappeared (e.g. the session got deleted),
    // fall back to whichever other source is available
    const effectiveMode: ViewMode =
        viewMode == "session" && lastSession ? "session"
            : viewMode == "plan" && lastPlan ? "plan"
                : lastSession ? "session"
                    : lastPlan ? "plan"
                        : null;
    const session = effectiveMode == "session" ? lastSession : effectiveMode == "plan" ? lastPlan : null;

    return (
        <div className={styles.details}>
            <div className={styles.detailsHeader}>
                <div className={styles.detailsHeaderLeft}>
                    <h2 className={styles.detailsTitle}>
                        {workout.name}
                    </h2>
                    <p className={styles.detailsMetaData}>
                        <span className={lastSessionClass}>
                            {lastRelativeDate}
                        </span>
                        <span>&bull;</span>
                        <span>{getExercisesLabel(workout.workoutExercises.length)}</span>
                    </p>
                </div>
                <div className={styles.detailsHeaderRight}>
                    <button type="button"
                        className={`button-secondary`}
                        onClick={() => savePerformedSession(workout.id)}>
                        <ListChecks size={16} />Track Progress
                    </button>
                    <div className={styles.detailsMenuWrap}>
                        <KebabMenu items={menuItems} />
                    </div>
                </div>
            </div>
            {
                lastSession && lastPlan &&
                <div className={styles.detailsSourceControls}>
                    <button type="button"
                        aria-pressed={effectiveMode == "session"}
                        className={
                            `${styles.detailsSourceControlsBtn} button-secondary ${effectiveMode == "session" ? styles.active : ""}`
                        }
                        onClick={() => setViewMode("session")}
                    >
                        Last Session
                    </button>
                    <button type="button"
                        aria-pressed={effectiveMode == "plan"}
                        className={
                            `${styles.detailsSourceControlsBtn} button-secondary ${effectiveMode == "plan" ? styles.active : ""}`
                        }
                        onClick={() => setViewMode("plan")}
                    >
                        Plan
                    </button>
                </div>
            }
            {
                ((!lastSession && lastPlan) || (lastSession && !lastPlan))
                &&
                <p className={styles.detailsSource}>
                    Showing: {lastSession ? "Last Session" : "Last Plan"}
                </p>
            }
            {
                session
                    ? <div className={styles.workoutDetailsContent}>
                        <ExerciseList
                            workout={workout}
                            session={session}
                        />
                    </div>
                    : <p className={styles.detailsNoDataMsg}>
                        No data yet — track a session to see your progress here.
                    </p>
            }
        </div>
    )
}
