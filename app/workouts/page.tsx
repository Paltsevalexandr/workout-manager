"use client"

import { useEffect, useState, type SubmitEvent } from 'react'
import { useExercisesContext, useWorkoutsContext } from '@/app/providers';
import Content from '../components/layout/Content';
import styles from './page.module.scss';
import { Workout, WorkoutExercise } from '../_types';
import { generateID } from '../../lib/data';
import WorkoutsList from './_components/WorkoutsList';
import WorkoutForm from './_components/WorkoutForm';
import { Plus } from 'lucide-react';

type Props = {}

export default function page({ }: Props) {
    const { exercises } = useExercisesContext();
    const { workouts, setWorkouts } = useWorkoutsContext();

    const [workoutToEdit, setWorkoutToEdit] = useState<Workout | null>(null);
    const [workoutName, setWorkoutName] = useState<string>("");
    const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
    const [isCreateWorkoutFormOpen, setIsCreateWorkoutFormOpen] = useState(false);
    const [isEditWorkoutFormOpen, setIsEditWorkoutFormOpen] = useState(false);

    useEffect(() => {
        if (exercises.length) {
            setWorkoutExercises([
                { id: null, workoutTemplateId: null, exerciseId: exercises[0].id }
            ]);
        }
    }, [])

    function createWorkout(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        // TODO - send to server new workout and get the ID
        const newWorkoutId = generateID(workouts);
        const allWorkoutExercises: WorkoutExercise[] = workouts.flatMap(w => w.workoutExercises);

        const newWorkoutExercises: WorkoutExercise[] = workoutExercises.map((we, i) => ({
            id: generateID(allWorkoutExercises) + i,
            workoutTemplateId: newWorkoutId,
            exerciseId: we.exerciseId,
        }));

        setWorkouts((currentWorkouts) => [
            ...currentWorkouts,
            {
                id: newWorkoutId,
                name: workoutName,
                workoutExercises: newWorkoutExercises,
            },
        ]);
        setWorkoutExercises([
            { id: null, workoutTemplateId: null, exerciseId: exercises[0]?.id ?? -1 }
        ]);
        setWorkoutName("");
        setIsCreateWorkoutFormOpen(false);
    }

    function editWorkout(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        // TODO - send to server
        setWorkouts((currentWorkouts) => {
            return currentWorkouts.map((workout) => {
                if (workoutToEdit?.id !== workout.id) {
                    return workout;
                }

                const allWorkoutExercises: WorkoutExercise[] = currentWorkouts.flatMap(w => w.workoutExercises);

                const updatedWorkoutExercises: WorkoutExercise[] = workoutExercises.map((we) => {
                    // существующее вхождение — сопоставляем по id, а не по позиции
                    if (we.id !== null) {
                        return { ...we, workoutTemplateId: workout.id };
                    }
                    // новая строка, добавленная в форме — создаём новый WorkoutExercise
                    return {
                        id: generateID(allWorkoutExercises),
                        workoutTemplateId: workout.id,
                        exerciseId: we.exerciseId,
                    };
                });

                return {
                    id: workout.id,
                    name: workoutName,
                    workoutExercises: updatedWorkoutExercises,
                };
            });
        });
        setWorkoutToEdit(null);
        setWorkoutExercises([
            { id: null, workoutTemplateId: null, exerciseId: exercises[0]?.id ?? -1 }
        ]);
        setWorkoutName("");
        setIsEditWorkoutFormOpen(false);
    }

    function handleCancelForm() {
        setWorkoutExercises([
            { id: null, workoutTemplateId: null, exerciseId: exercises[0]?.id ?? -1 }
        ]);
        setWorkoutName("");
        setIsCreateWorkoutFormOpen(false);
        setIsEditWorkoutFormOpen(false);
        setWorkoutToEdit(null);
    }

    function handleEdit(workoutIndex: number) {
        setWorkoutToEdit(workouts[workoutIndex]);
        setWorkoutName(workouts[workoutIndex].name);
        setWorkoutExercises([...workouts[workoutIndex].workoutExercises]);
        setIsEditWorkoutFormOpen(true);
    }

    return (
        <Content title="Workouts">
            <section >
                <div className="section-content">
                    <div className={styles.workoutsListWrap}>
                        <WorkoutsList
                            exercises={exercises}
                            workouts={workouts}
                            handleEdit={handleEdit}
                            setIsEditWorkoutFormOpen={setIsEditWorkoutFormOpen} />
                        <button
                            type="button"
                            onClick={() => setIsCreateWorkoutFormOpen(true)}
                        >
                            <span><Plus size={16} /></span>Add Workout
                        </button>
                    </div>

                    {
                        isCreateWorkoutFormOpen &&
                        <WorkoutForm
                            exercises={exercises}
                            workoutName={workoutName}
                            handleCancelForm={handleCancelForm}
                            handleSubmit={createWorkout}
                            setWorkoutName={setWorkoutName}
                            workoutExercises={workoutExercises}
                            setWorkoutExercises={setWorkoutExercises}
                        />
                    }
                    {
                        isEditWorkoutFormOpen &&
                        <WorkoutForm
                            editWorkout={workoutToEdit}
                            workoutName={workoutName}
                            exercises={exercises}
                            handleCancelForm={handleCancelForm}
                            handleSubmit={editWorkout}
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

