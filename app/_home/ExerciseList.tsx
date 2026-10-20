import styles from "../page.module.scss";
import { Workout, PerformedSession, PlannedSession, PerformedExercise, PlannedExercise } from "@/_types";
import ExerciseItem from "./ExerciseItem";
import { getExerciseById, getSourceExercises, getWorkoutExercise, isPlannedSession } from "@/lib";
import { useExercisesContext } from "@/app/providers";

type Props = {
    workout: Workout;
    session: PerformedSession | PlannedSession;
}

export default function ExerciseList({ workout, session }: Props) {
    const { exercises } = useExercisesContext();
    // A plan is shown against the current workout: rows whose exercise was removed
    // from the workout (or the catalog) are hidden. Exercises added after the plan
    // was saved have no values yet, so they appear only once the plan is re-saved.
    // A performed session is history and is shown as it was.
    const sourceExercises: (PerformedExercise | PlannedExercise)[] = isPlannedSession(session)
        ? session.plannedExercises.filter(plannedExercise => {
            const workoutExercise = getWorkoutExercise(plannedExercise.workoutExerciseId, workout);
            const exercise = getExerciseById(exercises, workoutExercise?.exerciseId);
            return workoutExercise && !workoutExercise.isDeleted && exercise && !exercise.isDeleted;
        })
        : getSourceExercises(session);
    const hasWeight = sourceExercises.some(exercise => exercise.weight > 0);
    return (
        <ul className={styles.detailsExercises}>
            <li className={styles.detailsExercisesHeader}>
                <div className={styles.detailsExercisesHeaderName}>
                    Exercise Name
                </div>
                <div className={`${styles.detailsExercisesHeaderInfo} ${hasWeight ? styles.hasWeight : ""}`}>
                    {
                        hasWeight &&
                        <span className={styles.detailsExercisesHeaderWeight}>
                            Weight
                        </span>
                    }
                    <span className={styles.detailsExercisesHeaderVolume}>
                        Sets &times; Reps/Dur.
                    </span>
                    <span className={styles.detailsExercisesHeaderRest}>
                        Rest
                    </span>
                </div>
            </li>
            {
                sourceExercises.map((sourceExercise) => {
                    return <ExerciseItem key={`source_exercise_${sourceExercise.id}`}
                        workout={workout}
                        sourceExercise={sourceExercise}
                        hasWeight={hasWeight}
                    />
                })
            }
        </ul>
    )
}
