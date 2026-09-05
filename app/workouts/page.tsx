"use client"

import { useState, type SubmitEvent } from 'react'
import { useExercisesContext } from '@/app/providers';
import Content from '../components/layout/Content';
import styles from './page.module.scss';
import Modal from '../components/ui/Modal';
import ModalForm from '../components/ui/ModalForm';
import { Workout, WorkoutExercise, Exercise, days, Day } from '../_types';
import SelectField from '../components/forms/SelectField';
import { capitalize, dayNames } from "../lib";
import TextField from '../components/forms/TextField';
import NumberField from '../components/forms/NumberField';
import { generateID } from '../lib/data';
import WorkoutsList from './_components/WorkoutsList';

type Props = {}

export default function page({ }: Props) {
    const { exercises } = useExercisesContext();
    let workoutExerciseLayout = {
        id: null,
        exerciseId: exercises[0]?.id ?? -1,
        sets: 1,
        target: 1,
        weight: undefined,
        rest: 30
    };
    
    const [workouts, setWorkouts] = useState<Workout[]>([
        {
            id: 0, name: 'Workout 1', day: 0, exercises: [
                {
                    exerciseId: 0,
                    id: null,
                    rest: 30,
                    sets: 1,
                    target: 1,
                    weight:undefined
                }
            ]
        },
        {
            id: 1, name: 'Workout 2', day: 0, exercises: [
                {
                    exerciseId: 0,
                    id: null,
                    rest: 30,
                    sets: 1,
                    target: 1,
                    weight: undefined
                }
            ]
        },
        {
            id: 2, name: 'Workout 3', day: 1, exercises: [
                {
                    exerciseId: 1,
                    id: null,
                    rest: 30,
                    sets: 1,
                    target: 1,
                    weight: 30
                }
            ]
        }
    ]);
    
    const [workoutName, setWorkoutName] = useState<string>("");
    const [workoutDay, setWorkoutDay] = useState<Day>(days[0]);
    const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([{...workoutExerciseLayout}]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        // TODO - send to server new workout and get the ID
        setWorkouts((currentWorkouts) => [
            ...currentWorkouts,
            {
                id: generateID(workouts),
                name: workoutName,
                day: workoutDay,
                exercises: workoutExercises
            }
        ]);
        setWorkoutDay(days[0]);
        setWorkoutExercises([{...workoutExerciseLayout}]);
        setWorkoutName("");
        setIsFormOpen(false);
    }

    function handleCancelForm() {
        setWorkoutDay(days[0]);
        setWorkoutExercises([{...workoutExerciseLayout}]);
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
                            className="addButton"
                            type="button"
                            onClick={() => setIsFormOpen(true)}
                        >
                            <span>+</span>
                        </button>
                    </div>
                    
                    {isFormOpen && (
                        <Modal onClose={handleCancelForm}>
                            <ModalForm
                                modalName='New Workout'
                                submitText="Add workout"
                                onSubmit={handleSubmit}
                                onCancel={handleCancelForm}
                            >
                                {
                                    exercises.length
                                        ? <>
                                            <TextField
                                                label="Workout Name"
                                                name="workout-name"
                                                value={workoutName}
                                                required={true}
                                                onChange={setWorkoutName}
                                            />
                                            <SelectField
                                                label="Day"
                                                name="day"
                                                value={workoutDay}
                                                options={days}
                                                optionsNames={dayNames}
                                                parseValue={(value) => Number(value) as Day}
                                                onChange={setWorkoutDay}
                                                />
                                            <div className={styles.exercises}>
                                                <h3>Exercises</h3>
                                                {
                                                    workoutExercises.map((exercise, index) => {
                                                        let exerciseObj = exercises.find(ex => ex.id == exercise.exerciseId);
                                                        let target = exerciseObj?.target;
                                                        let useWeight = exerciseObj?.useWeight;
                                                        return (
                                                            <div key={exercise.exerciseId + "_" + index + "_workout_exercise_wrap"}>
                                                                <SelectField
                                                                    key={exercise.exerciseId + "_" + index + "_workout_exercise"}
                                                                    label=""
                                                                    name="workout-exercise[]"
                                                                    value={workoutExercises[index].exerciseId}
                                                                    options={exercises.map(exercise => exercise.id)}
                                                                    optionsNames={exercises.map(exercise => exercise.name)}
                                                                    parseValue={Number}
                                                                    onChange={(value) => setWorkoutExercises((currentWorkoutExercises) => {
                                                                        return currentWorkoutExercises.map((exercise, i) => {
                                                                            return index == i
                                                                                ? { ...exercise, exerciseId: value }
                                                                                : exercise;
                                                                        });
                                                                    })}
                                                                />
                                                                <NumberField
                                                                    key={exercise.exerciseId + "_" + index + "_workout_exercise_target"}
                                                                    label={target == null ? "Unknown" : capitalize(target)}
                                                                    name="workout-exercise-target"
                                                                    value={workoutExercises[index].target}
                                                                    onChange={(value) => setWorkoutExercises((currentWorkoutExercises) => {
                                                                        return currentWorkoutExercises.map((exercise, i) => {
                                                                            return index == i
                                                                                ? { ...exercise, target: value }
                                                                                : exercise;
                                                                        });
                                                                    })}
                                                                />
                                                                <NumberField
                                                                    key={exercise.exerciseId + "_" + index + "_workout_exercise_sets"}
                                                                    label="Sets"
                                                                    name="workout-exercise-sets"
                                                                    value={workoutExercises[index].sets}
                                                                    onChange={(value) => setWorkoutExercises((currentWorkoutExercises) => {
                                                                        return currentWorkoutExercises.map((exercise, i) => {
                                                                            return index == i
                                                                                ? { ...exercise, sets: value }
                                                                                : exercise;
                                                                        });
                                                                    })}
                                                                />
                                                                {
                                                                    useWeight
                                                                    ? <NumberField
                                                                        key={exercise.exerciseId + "_" + index + "_workout_exercise_weight"}
                                                                        label="Additional Weight (kg)"
                                                                        name="workout-exercise-weight"
                                                                        value={workoutExercises[index].weight ?? 0}
                                                                        onChange={(value) => setWorkoutExercises((currentWorkoutExercises) => {
                                                                            return currentWorkoutExercises.map((exercise, i) => {
                                                                                return index == i
                                                                                    ? { ...exercise, weight: value }
                                                                                    : exercise;
                                                                            });
                                                                        })}
                                                                    />
                                                                    : null
                                                                }
                                                                {
                                                                    workoutExercises[index].sets > 1
                                                                    ? <NumberField
                                                                        key={exercise.exerciseId + "_" + index + "_workout_exercise_rest"}
                                                                        label="Rest"
                                                                        name="workout-exercise-rest"
                                                                        value={workoutExercises[index].rest}
                                                                        onChange={(value) => setWorkoutExercises((currentWorkoutExercises) => {
                                                                            return currentWorkoutExercises.map((exercise, i) => {
                                                                                return index == i
                                                                                    ? { ...exercise, rest: value }
                                                                                    : exercise;
                                                                            });
                                                                        })}
                                                                        />
                                                                    : null
                                                                }
                                                            </div>
                                                        )
                                                    })
                                                }
                                                <button
                                                    className="addButton"
                                                    type="button"
                                                    onClick={() => setWorkoutExercises([...workoutExercises, {...workoutExerciseLayout}])}
                                                >
                                                    <span>+</span>
                                                </button>
                                            </div>
                                            
                                        </>
                                    : <p>Add some exercises to create workout</p>
                                }
                            </ModalForm>
                        </Modal>
                    )}
                </div>
            </section>
        </Content>
    )
}
