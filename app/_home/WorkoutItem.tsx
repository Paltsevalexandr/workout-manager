import { capitalize, formatRelativeDate, getExercisesLabel, getLastPlan, getLastSessionClass, getLastSessionIcon } from '@/lib';
import styles from "../page.module.scss";
import { Workout, PlannedSession, } from '@/_types';
import { CalendarCheck, ListChecks } from 'lucide-react';

type Props = {
    selectedWorkout: Workout | null;
    workout: Workout;
    lastSessionDate: number | null,
    plannedSessions: PlannedSession[];
    setSelectedWorkout: () => void;
    savePerformedSession: () => void;
}

export default function WorkoutItem({
    selectedWorkout,
    workout,
    lastSessionDate,
    plannedSessions,
    setSelectedWorkout,
    savePerformedSession
}: Props) {
    const lastRelativeDate: string = formatRelativeDate(lastSessionDate);
    const lastSessionClass = getLastSessionClass(lastSessionDate, styles);
    const lastSessionIcon = getLastSessionIcon(lastSessionDate);
    const exercisesAmount = workout.workoutExercises.length;
    const hasPlan: PlannedSession | null = getLastPlan(workout.id, plannedSessions);
    return (
        <li className={`${styles.workout} ${selectedWorkout?.id == workout.id ? styles.active : ""}`}
            onClick={() => setSelectedWorkout()}>
            <div className={styles.workoutTop}>
                <div className={styles.workoutNameWrap}>
                    <h4 className={styles.workoutName}>
                        {capitalize(workout.name)}
                    </h4>
                    {
                        hasPlan && <CalendarCheck size={16} />
                    }
                </div>
                <button className={styles.workoutTrackProgressBtn}
                    onClick={(e) => {
                        e.stopPropagation();
                        savePerformedSession();
                    }}>
                    <ListChecks size={16} />
                </button>
            </div>
            <div className={styles.workoutBottom}>
                <p className={`${styles.workoutLastDate} ${lastSessionClass}`}>
                    {lastSessionIcon} {lastRelativeDate}
                </p>
                <p className={styles.workoutExercisesAmount}>
                    {getExercisesLabel(exercisesAmount)}
                </p>
            </div>
        </li>
    )
}
