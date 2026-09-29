import { PerformedExercise, Workout } from '@/_types';
import { useExercisesContext } from '@/app/providers';
import { getExerciseById, getTargetLabel, getWorkoutExercise } from '@/lib';
import styles from './ByDate.module.scss';


type Props = {
    workout: Workout;
    performedExercise: PerformedExercise;
}

export default function PerformedExerciseItem({
    workout,
    performedExercise
}: Props) {
    const { exercises } = useExercisesContext();
    const { workoutExerciseId } = performedExercise;
    const workoutExercise = getWorkoutExercise(workoutExerciseId, workout);
    if (!workoutExercise) {
        return null;
    }
    const { exerciseId } = workoutExercise;
    const exercise = getExerciseById(exercises, exerciseId);
    if (!exercise) {
        return null;
    }
    const { sets, target, weight, rest } = performedExercise;
    const targetLabel = `${target}${getTargetLabel(exercise)}`;

    return (
        <li className={styles.performedSessionExercise}>
            <div className={styles.performedSessionExerciseName}>
                {exercise.name}
            </div>
            <div className={styles.performedSessionExerciseData}>
                <div className={styles.performedSessionExerciseVolume}>
                    {sets} × {targetLabel}
                </div>
                <div>&bull;</div>
                {
                    weight > 0
                        ? <div className={styles.performedSessionExerciseWeight}>
                            {`${weight}kg`}
                        </div>
                        : null
                }

                {
                    weight > 0 && <div>&bull;</div>
                }
                <div className={styles.performedSessionExerciseRest}>
                    {rest}s
                </div>
            </div>
        </li>
    )
}
