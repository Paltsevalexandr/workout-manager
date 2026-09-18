import { Exercise, Workout, WorkoutExercise, WorkoutSession, PerformedExercise, Target } from '@/_types';
import SelectField from '@/app/components/forms/SelectField';
import { useExercisesContext } from '@/app/providers';
import { capitalize, formatFullDate } from '@/lib';
import { useState } from 'react'
import styles from './ByExercise.module.scss';

type Props = {
    workout: Workout;
    performedSessions: WorkoutSession[];
}

export default function ByExercise({ workout, performedSessions }: Props) {
    const { exercises } = useExercisesContext();

    const performedExercises = getTrackedWorkoutExercises(workout, performedSessions);
    const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(
        performedExercises[0]?.id ?? null
    );

    type TrackedWorkoutExercise = WorkoutExercise & { id: number };
    type StatField = "sets" | "target" | "weight" | "rest";

    const exercise = exercises.find(
        e => e.id === performedExercises.find(ex => ex.id === selectedExerciseId)?.exerciseId
    );

    const sessionEntries = performedSessions
        .flatMap(session =>
            session.performedExercises
                .filter(pe => pe.workoutExerciseId === selectedExerciseId)
                .map(performedExercise => ({ session, performedExercise }))
        )
        .sort((a, b) => b.session.date - a.session.date);

    if (selectedExerciseId === null) {
        return (
            <div>
                <h3>You haven't trained yet.</h3>
            </div>
        )
    }

    const performedEntries = getPerformedExercises(sessionEntries);
    let relevantFields = getRelevantFields(performedEntries);
    const hasAnyWeight = relevantFields.includes("weight");

    function getTrackedWorkoutExercises(workout: Workout, sessions: WorkoutSession[]): TrackedWorkoutExercise[] {
        const usedIds = new Set(
            sessions.flatMap(session => session.performedExercises.map(pe => pe.workoutExerciseId))
        );
        return workout.workoutExercises.filter(
            (we): we is TrackedWorkoutExercise => we.id !== null && usedIds.has(we.id)
        );
    }

    function getExerciseSelectLabel(workoutExercise: WorkoutExercise, workout: Workout, exercises: Exercise[]): string {
        const exercise = exercises.find(e => e.id === workoutExercise.exerciseId);
        const sameNameEntries = workout.workoutExercises.filter(we => we.exerciseId === workoutExercise.exerciseId);
        if (sameNameEntries.length <= 1) {
            return exercise?.name ?? "Unknown";
        }
        const position = sameNameEntries.findIndex(we => we.id === workoutExercise.id) + 1;
        return `${exercise?.name} (${position})`;
    }

    function getRelevantFields(entries: PerformedExercise[]): StatField[] {
        const fields: StatField[] = ["sets", "target", "weight", "rest"];
        return fields.filter(field => entries.some(e => e[field] > 0));
    }

    function getSummaryFromValues(values: number[]) {
        const current = values[0];
        const first = values[values.length - 1];
        const best = Math.max(...values);
        const worst = Math.min(...values);
        return { first, current, best, worst, isAtBest: current === best };
    }
    function getProgressSummary(entries: PerformedExercise[], field: StatField) {
        return getSummaryFromValues(entries.map(e => e[field]));
    }
    function getFieldUnit(field: StatField): string {
        if (field === "weight") {
            return "kg";
        }
        if (field === "rest" || (field === "target" && exercise?.target === "duration")) {
            return "s";
        }
        return "";
    }
    function getVolumeValues(entries: PerformedExercise[]): number[] {
        return entries.map(e => hasAnyWeight ? e.sets * e.target * e.weight : e.sets * e.target);
    }
    function getVolumeUnit(): string {
        if (hasAnyWeight) {
            return "kg";
        }
        return exercise?.target === "duration" ? "s" : "reps";
    }
    function getPercentChange(current: number, first: number): number | null {
        return first !== 0 ? Math.round((current - first) / first * 1000) / 10 : null;
    }
    function getPerformedExercises(sessionEntries: { session: WorkoutSession, performedExercise: PerformedExercise }[]) {
        return sessionEntries.map(({ performedExercise }) => performedExercise);
    }


    const volumeValues = getVolumeValues(performedEntries);
    const volumeSummary = getSummaryFromValues(volumeValues);
    const showVolume = volumeSummary.best !== volumeSummary.worst;

    function renderDelta(current: number, first: number, best: number, isAtBest: boolean, unit: string) {
        const percentChange = getPercentChange(current, first);
        return (
            <>
                <p className={styles.exerciseStatDelta}>
                    {percentChange !== null && (
                        <span className={percentChange >= 0 ? styles.positive : styles.negative}>
                            {percentChange >= 0 ? "+" : ""}{percentChange}%
                        </span>
                    )}
                    {" "}since first · best {best}{unit}
                </p>
                {
                    isAtBest &&
                    <p className={styles.exerciseStatBest + " " + styles.positive}>
                        This is your best result
                    </p>}
            </>
        );
    }
    return (
        <div>
            <div className={styles.exerciseSelect}>
                <SelectField
                    label="Exercise"
                    name="exercise"
                    parseValue={Number}
                    value={selectedExerciseId}
                    options={performedExercises.map(ex => ex.id)}
                    optionsNames={performedExercises.map(ex => getExerciseSelectLabel(ex, workout, exercises))}
                    onChange={(id: number) => setSelectedExerciseId(id)}
                />
            </div>

            <p className={styles.exerciseSessionsAmount}>
                {`${sessionEntries.length} session${sessionEntries.length > 1 ? "s" : ""} logged`}
            </p>
            {
                (relevantFields.length || showVolume)
                && <ul className={styles.exerciseStatList}>
                    {
                        showVolume &&
                        <li className={styles.exerciseStat} key="volume">
                            <p className={styles.exerciseStatFieldName}>Volume</p>
                            <h2 className={styles.exerciseStatCurrent}>{volumeSummary.current}{getVolumeUnit()}</h2>
                            {renderDelta(volumeSummary.current, volumeSummary.first, volumeSummary.best, volumeSummary.isAtBest, getVolumeUnit())}
                        </li>
                    }
                    {
                        relevantFields.map(field => {
                            const { first, current, best, worst, isAtBest } = getProgressSummary(
                                performedEntries, field
                            );
                            if (best == worst) {
                                return null;
                            }

                            return (
                                <li className={styles.exerciseStat} key={field}>
                                    <p className={styles.exerciseStatFieldName}>
                                        {capitalize(field == "target" ? (exercise?.target == "reps" ? "Reps" : "Duration") : field)}
                                    </p>
                                    <h2 className={styles.exerciseStatCurrent}>{current}{getFieldUnit(field)}</h2>
                                    {renderDelta(current, first, best, isAtBest, getFieldUnit(field))}
                                </li>
                            )
                        })
                    }
                </ul>
            }


            <ul className={styles.list}>
                <li className={styles.header}>
                    <div className={styles.rowDate}>Date</div>
                    <div className={styles.rowSets}>Sets</div>
                    {hasAnyWeight ? <div className={styles.rowWeight}>Weight</div> : null}
                    <div className={styles.rowRest}>Rest</div>
                </li>
                {sessionEntries.map(({ session, performedExercise }) => {
                    const targetLabel = exercise?.target === "duration"
                        ? `${performedExercise.target}s`
                        : `${performedExercise.target}`;
                    return (
                        <li className={styles.row} key={`${session.id}_${performedExercise.id}`}>
                            <div className={styles.rowDate}>{formatFullDate(session.date)}</div>
                            <div className={styles.rowSets}>{performedExercise.sets} × {targetLabel}</div>
                            {hasAnyWeight ? <div className={styles.rowWeight}>{performedExercise.weight}kg</div> : null}
                            <div className={styles.rowRest}>{performedExercise.rest}s</div>
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}
