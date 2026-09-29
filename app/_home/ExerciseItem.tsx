import { PerformedExercise, WorkoutExercise, PlannedExercise } from '@/_types';
import styles from "../page.module.scss";
import { useExercisesContext } from '@/app/providers';
import { getTargetLabel } from '@/lib';

type Props = {
    workoutExercise: WorkoutExercise;
    hasWeight: boolean;
    sourceExercises: (PlannedExercise | PerformedExercise)[];
}

export default function ExerciseItem({
    workoutExercise, hasWeight, sourceExercises
}: Props) {
    const { exercises } = useExercisesContext();
    let exerciseData = exercises.find(ex => ex.id == workoutExercise.exerciseId);
    let sessionExercise = sourceExercises.find(
        (exercise) => workoutExercise.id == exercise.workoutExerciseId
    );
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
                        {
                            sessionExercise
                                ? sessionExercise.weight > 0 ? `${sessionExercise.weight}kg` : "\u2014"
                                : "\u2014"
                        }
                    </span>
                }
                <span className={styles.detailsExerciseVolume}>
                    {
                        sessionExercise
                            ? `${sessionExercise.sets}\u00D7${sessionExercise.target}${getTargetLabel(exerciseData)}`
                            : "\u2014"
                    }
                </span>
                <span className={styles.detailsExerciseRest}>
                    {
                        sessionExercise
                            ? `${sessionExercise.rest}s`
                            : "\u2014"
                    }
                </span>
            </div>
        </li>
    )
}
