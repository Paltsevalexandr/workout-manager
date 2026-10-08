import { PerformedExercise, PlannedExercise, Workout } from '@/_types';
import styles from "../page.module.scss";
import { useExercisesContext } from '@/app/providers';
import { getExerciseById, getTargetLabel, getWorkoutExercise } from '@/lib';

type Props = {
    workout: Workout;
    sourceExercise: PerformedExercise | PlannedExercise;
    hasWeight: boolean;
}

export default function ExerciseItem({
    workout, sourceExercise, hasWeight
}: Props) {
    const { exercises } = useExercisesContext();
    const workoutExercise = getWorkoutExercise(sourceExercise.workoutExerciseId, workout);
    if (!workoutExercise) {
        return null;
    }
    const exerciseData = getExerciseById(exercises, workoutExercise.exerciseId);
    if (!exerciseData) {
        return null;
    }
    return (
        <li className={styles.detailsExercise}>
            <div className={styles.detailsExerciseName}>
                {exerciseData.name}
            </div>
            <div className={`${styles.detailsExerciseInfo} ${hasWeight ? styles.hasWeight : ""}`}>
                {
                    hasWeight &&
                    <span className={styles.detailsExerciseWeight}>
                        {sourceExercise.weight > 0 ? `${sourceExercise.weight}kg` : "—"}
                    </span>
                }
                <span className={styles.detailsExerciseVolume}>
                    {`${sourceExercise.sets}×${sourceExercise.target}${getTargetLabel(exerciseData)}`}
                </span>
                <span className={styles.detailsExerciseRest}>
                    {`${sourceExercise.rest}s`}
                </span>
            </div>
        </li>
    )
}
