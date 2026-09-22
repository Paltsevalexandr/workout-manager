import styles from "../../page.module.scss";
import { Workout, WorkoutSession } from '@/_types';
import ExerciseList from './ExerciseList';
import { formatRelativeDate, getExercisesLabel, getLastSessionDate, getStatusClass } from '@/lib';
import KebabMenu, { MenuItem } from '../ui/KebabMenu';
import { ListChecks } from "lucide-react";

type Props = {
    workout: Workout;
    workoutSessions: WorkoutSession[];
    savePerformedSession: (workoutId: number) => void;
    createNextSessionPlan: (workoutId: number) => void;
    menuItems: MenuItem[];
}

export default function WorkoutDetails({
    workout,
    workoutSessions,
    menuItems,
    savePerformedSession,
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
                        <ListChecks size={16} />Track Progress
                    </button>
                    <div className={styles.detailsMenuWrap}>
                        <KebabMenu items={menuItems} />
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
