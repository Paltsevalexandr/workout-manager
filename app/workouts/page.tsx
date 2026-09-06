"use client"

import { useEffect, useState, type SubmitEvent } from 'react'
import { useExercisesContext } from '@/app/providers';
import Content from '../components/layout/Content';
import styles from './page.module.scss';
import { Workout, WorkoutExercise, Exercise, days, Day } from '../_types';
import { generateID } from '../lib/data';
import WorkoutsList from './_components/WorkoutsList';
import WorkoutForm from './_components/WorkoutForm';

type Props = {}

export default function page({ }: Props) {
    const { exercises } = useExercisesContext();
    let workoutExerciseLayout = {
        id: null,
        exerciseId: exercises[0]?.id ?? -1,
        sets: 1,
        target: 1,
        weight: 0,
        rest: 30
    };

    const [workouts, setWorkouts] = useState<Workout[]>([
        {
            id: 0, name: 'Workout 1', exercises: [4, 5, 6]
        },
        {
            id: 1, name: 'Workout 2', exercises: [2, 4, 5]
        },
        {
            id: 2, name: 'Workout 3', exercises: [0, 1, 3]
        }
    ])
    // const [workouts, setWorkouts] = useState<Workout[]>([
    //     {
    //         id: 0, name: 'Workout 1', day: 0, exercises: [
    //             {
    //                 exerciseId: 0,
    //                 id: null,
    //                 rest: 30,
    //                 sets: 1,
    //                 target: 1,
    //                 weight: 0
    //             }
    //         ]
    //     },
    //     {
    //         id: 1, name: 'Workout 2', day: 0, exercises: [
    //             {
    //                 exerciseId: 0,
    //                 id: null,
    //                 rest: 30,
    //                 sets: 1,
    //                 target: 1,
    //                 weight: 0
    //             }
    //         ]
    //     },
    //     {
    //         id: 2, name: 'Workout 3', day: 1, exercises: [
    //             {
    //                 exerciseId: 1,
    //                 id: null,
    //                 rest: 30,
    //                 sets: 1,
    //                 target: 1,
    //                 weight: 30
    //             }
    //         ]
    //     }
    // ]);

    const [workoutName, setWorkoutName] = useState<string>("");
    const [workoutExercises, setWorkoutExercises] = useState<Exercise["id"][]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        if (exercises.length) {
            setWorkoutExercises([0]);
        }
    }, [])



    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        // TODO - send to server new workout and get the ID
        setWorkouts((currentWorkouts) => [
            ...currentWorkouts,
            {
                id: generateID(workouts),
                name: workoutName,
                exercises: workoutExercises
            }
        ]);
        setWorkoutExercises([0]);
        setWorkoutName("");
        setIsFormOpen(false);
    }

    function handleCancelForm() {
        setWorkoutExercises([0]);
        setWorkoutName("");
        setIsFormOpen(false);
    }

    return (
        <Content title="Workouts">
            <section >
                <div className="section-content">
                    <div className={styles.workoutsListWrap}>
                        <WorkoutsList
                            exercises={exercises}
                            workouts={workouts} />
                        <button
                            type="button"
                            onClick={() => setIsFormOpen(true)}
                        >
                            <span>+</span>Add Workout
                        </button>
                    </div>

                    {
                        isFormOpen &&
                        <WorkoutForm
                            exercises={exercises}
                            workoutName={workoutName}
                            handleCancelForm={handleCancelForm}
                            handleSubmit={handleSubmit}
                            setWorkoutName={setWorkoutName}
                            workoutExercises={workoutExercises}
                            setWorkoutExercises={setWorkoutExercises}
                        />
                    }
                </div>
            </section>
        </Content>
    )
}
