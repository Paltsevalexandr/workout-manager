import { formatRelativeDate, getExercisesLabel, getLastPlan, getLastSessionClass, getLastSessionIcon, getWorkoutExercises } from "@/lib";
import styles from "../page.module.scss";
import { Workout, PlannedSession, } from "@/_types";
import { CalendarCheck, ListChecks } from "lucide-react";
import { useExercisesContext } from "@/app/providers";

type Props = {
    selectedWorkout: Workout | null;
    workout: Workout;
    lastSessionDate: number | null,
    plannedSessions: PlannedSession[];
    setSelectedWorkout: () => void;
    openPerformedSessionForm: () => void;
}

export default function WorkoutItem({
    selectedWorkout,
    workout,
    lastSessionDate,
    plannedSessions,
    setSelectedWorkout,
    openPerformedSessionForm
}: Props) {
    const { exercises } = useExercisesContext();
    const lastRelativeDate: string = formatRelativeDate(lastSessionDate);
    const lastSessionClass = getLastSessionClass(lastSessionDate, styles);
    const lastSessionIcon = getLastSessionIcon(lastSessionDate);
    const exercisesAmount = getWorkoutExercises(workout, exercises).length;
    const hasPlan: PlannedSession | null = getLastPlan(workout.id, plannedSessions);
    return (
        <li className={`${styles.workout} ${selectedWorkout?.id == workout.id ? styles.active : ""}`}
            onClick={() => setSelectedWorkout()}>
            <div className={styles.workoutTop}>
                <div className={styles.workoutNameWrap}>
                    <h4 className={styles.workoutName}>
                        {workout.name}
                    </h4>
                    {
                        hasPlan && <CalendarCheck size={16} />
                    }
                </div>
                <button className={styles.workoutTrackProgressBtn}
                    onClick={(e) => {
                        e.stopPropagation();
                        openPerformedSessionForm();
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
