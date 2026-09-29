import styles from "../../page.module.scss";
import { Workout, PerformedSession, Exercise, Category, MuscleGroup } from '@/_types';
import ExerciseList from './ExerciseList';
import { formatRelativeDate, getExercisesLabel, getLastPlan, getLastSession, getLastSessionDate, getLastSessionClass, formatFullDate, capitalize } from '@/lib';
import KebabMenu, { MenuItem } from '../ui/KebabMenu';
import { ListChecks } from "lucide-react";
import { useExercisesContext, usePlannedSessionsContext } from "@/app/providers";
import { useEffect, useState } from "react";

type Props = {
    workout: Workout;
    performedSessions: PerformedSession[];
    savePerformedSession: (workoutId: number) => void;
    menuItems: MenuItem[];
}

export default function WorkoutDetails({
    workout,
    performedSessions,
    menuItems,
    savePerformedSession,
}: Props) {
    type ViewMode = "session" | "plan" | null;
    const { exercises } = useExercisesContext();
    const { plannedSessions } = usePlannedSessionsContext();
    const lastSession = getLastSession(workout.id, performedSessions);
    const lastPlan = getLastPlan(workout.id, plannedSessions)
    const lastSessionDate = getLastSessionDate(workout.id, performedSessions);
    const lastSessionClass = getLastSessionClass(lastSessionDate, styles);
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

    const muscleGroupClassMap: Record<string, string> = {
        "Legs": "muscleGroupLegs",
        "Chest": "muscleGroupChest",
        "Back": "muscleGroupBack",
        "Shoulders": "muscleGroupShoulders",
        "Arms": "muscleGroupArms",
        "Core": "muscleGroupCore",
    };
    const categoryClassMap: Record<string, string> = {
        "strength": "categoryStrength",
        "cardio": "categoryCardio",
        "mobility": "categoryMobility",
        "stretching": "categoryStretching",
        "stamina": "categoryStamina",
        "recovery": "categoryRecovery",
        "balance": "categoryBalance",
        "plyometric": "categoryPlyometric",
    };
    function getWorkoutCategories(workout: Workout, exercises: Exercise[]): Category[] {
        const ids = new Set(workout.workoutExercises.map(we => we.exerciseId)); // get Set of exercise ids in workout
        const cats = exercises.filter(e => ids.has(e.id)).flatMap(e => e.categories); // get array of categories
        return [...new Map(cats.map(cat => [cat.id, cat])).values()]; // remove id duplication
    }

    function getWorkoutMuscleGroups(workout: Workout, exercises: Exercise[]): MuscleGroup[] {
        const ids = new Set(workout.workoutExercises.map(we => we.exerciseId));
        const groups = exercises.filter(e => ids.has(e.id) && e.parent === null).flatMap(e => e.muscleGroups);
        return [...new Map(groups.map(g => [g.id, g])).values()]; // remove id duplication
    }
    const session = effectiveMode == "session" ? lastSession : effectiveMode == "plan" ? lastPlan : null;
    const workoutCategories = getWorkoutCategories(workout, exercises);
    const workoutMuscleGroups = getWorkoutMuscleGroups(workout, exercises);
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
            <div className={styles.detailsWorkoutCategoriesWrap}>
                <h3 className={styles.detailsWorkoutCategoriesTitle}>
                    Categories
                </h3>
                <div className={styles.detailsWorkoutCategories}>
                    {
                        workoutCategories.map(cat => {
                            const colorClass = styles[categoryClassMap[cat.name]] ?? "";
                            return (
                                <span key={`workout_cat_${cat.id}`}
                                    className={`${styles.detailsWorkoutCategory} ${colorClass}`}>
                                    {capitalize(cat.name)}
                                </span>
                            )
                        })
                    }
                </div>
            </div>
            <div className={styles.detailsWorkoutMuscleGroupsWrap}>
                <h3 className={styles.detailsWorkoutMuscleGroupsTitle}>
                    Muscle Groups
                </h3>
                <div className={styles.detailsWorkoutMuscleGroups}>
                    {
                        workoutMuscleGroups.map(group => {
                            const colorClass = styles[muscleGroupClassMap[group.name]] ?? "";
                            return (
                                <span key={`workout_muscle_group_${group.id}`}
                                    className={`${styles.detailsWorkoutMuscleGroup} ${colorClass}`}>
                                    {capitalize(group.name)}
                                </span>
                            )
                        })
                    }
                </div>
            </div>
            <div className={styles.detailsSourceWrap}>
                {
                    (lastSession && lastPlan) ?
                        <div className={styles.detailsSourceControls} role="group" aria-label="Data source">
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
                        :
                        (lastSession || lastPlan)
                            ?
                            <p className={styles.detailsSource}>
                                Showing: {lastSession ? "Last Session" : "Last Plan"}
                            </p>
                            : null
                }
                {
                    session &&
                    <p className={styles.detailsSessionDate}>
                        {`${effectiveMode == "session" ? "Last session" : "Planned for"}: ${formatFullDate(session.date)}`}
                    </p>
                }
            </div>
            {
                session
                    ? <ExerciseList
                        workout={workout}
                        session={session}
                    />
                    : <p className={styles.detailsNoDataMsg}>
                        No data yet — track a session to see your progress here.
                    </p>
            }
        </div>
    )
}
