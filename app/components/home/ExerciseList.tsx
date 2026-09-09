import { MouseEvent, useState } from 'react';
import styles from "../../page.module.scss";
import { Exercise, Workout, WorkoutSession } from '@/app/_types';
import { getLastSession } from '@/app/lib';
import ExerciseItem from './ExerciseItem';
import { ChevronUp, ChevronDown } from "lucide-react";

type Props = {
    exercises: Exercise[];
    workout: Workout;
    workoutSessions: WorkoutSession[];
    index: number;
}

export default function ExerciseList({ exercises, workout, workoutSessions, index }: Props) {
    const [isDisplayAllExercises, setIsDisplayAllExercises] = useState<boolean>(false);
    const maxDisplayedExercises = 3;
    const visibleExercises = workout.exercises.slice(0, maxDisplayedExercises);
    const remainingExercises = workout.exercises.slice(maxDisplayedExercises);
    const lastSession = getLastSession(workout.id, workoutSessions);

    function toggleRemainingExercises(e: MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        setIsDisplayAllExercises(prev => !prev);
    }
    return (
        <ul className={styles.workoutExercises}>
            {
                visibleExercises.map((exerciseId, i) => {
                    return <ExerciseItem key={`workout_exercise_${index}_${i}`}
                        exerciseId={exerciseId}
                        exercises={exercises}
                        lastSession={lastSession}
                    />
                })
            }
            {
                remainingExercises.length > 0
                    ? <>
                        {
                            isDisplayAllExercises
                                ? <>
                                    {
                                        remainingExercises.map((exerciseId, i) => {
                                            return <ExerciseItem
                                                key={`workout_exercise_${index}_${i + maxDisplayedExercises}`}
                                                exerciseId={exerciseId}
                                                exercises={exercises}
                                                lastSession={lastSession}
                                            />
                                        })
                                    }
                                </>
                                : null
                        }
                        <li key={`workout_exercise_last_${index}`}
                            className={styles.workoutExerciseRemaining}>
                            <a href="#" className={styles.workoutExerciseRemainingLink}
                                onClick={toggleRemainingExercises}>
                                {
                                    isDisplayAllExercises
                                        ? <>
                                            <span>Show Less</span>
                                            <ChevronUp size={16} />
                                        </>
                                        : <>
                                            <span>{`+ ${remainingExercises.length} more`}</span>
                                            <ChevronDown size={16} />
                                        </>
                                }
                            </a>
                        </li>
                    </>
                    : null
            }
        </ul>
    )
}
