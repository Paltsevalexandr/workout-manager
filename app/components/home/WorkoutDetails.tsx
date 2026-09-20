import styles from "../../page.module.scss";
import { Workout, WorkoutSession } from '@/_types';
import ExerciseList from './ExerciseList';
import { formatRelativeDate, getExercisesLabel, getLastSessionDate, getStatusClass } from '@/lib';
import KebabMenu from '../ui/KebabMenu';

type Props = {
    workout: Workout;
    workoutSessions: WorkoutSession[];
    savePerformedSession: (workoutId: number) => void;
    createNextSessionPlan: (workoutId: number) => void;
}

export default function WorkoutDetails({
    workout,
    workoutSessions,
    savePerformedSession,
    createNextSessionPlan

}: Props) {
    const lastSessionDate = getLastSessionDate(workout.id, workoutSessions);
    const lastSessionClass = getStatusClass(lastSessionDate, styles);
    const lastRelativeDate: string = formatRelativeDate(lastSessionDate);

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
                    <button className={`button-secondary`}
                        onClick={() => savePerformedSession(workout.id)}>
                        Track Progress
                    </button>
                    <div className={styles.detailsMenuWrap}>
                        <KebabMenu items={[
                            {
                                label: "Plan Next Session",
                                onClick: () => createNextSessionPlan(workout.id)
                            },
                            {
                                label: "History",
                                href: `/workouts/${workout.id}/history`
                            }
                        ]} />
                    </div>
                </div>
            </div>
            <div className={styles.workoutDetailsContent}>
                <ExerciseList
                    workout={workout}
                    workoutSessions={workoutSessions}
                />
            </div>
        </div>
    )
}
