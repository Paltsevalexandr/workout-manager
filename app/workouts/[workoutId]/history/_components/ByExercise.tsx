import { Exercise, Workout, WorkoutExercise, WorkoutSession, PerformedExercise, Target } from '@/_types';
import SelectField from '@/app/components/forms/SelectField';
import { useExercisesContext } from '@/app/providers';
import { capitalize, formatFullDate } from '@/lib';
import { useState } from 'react'
import styles from './ByExercise.module.scss';
import { TrackedWorkoutExercise } from '../page';

type Props = {
    workout: Workout;
    performedSessions: WorkoutSession[];
    selectedExerciseId: number | null;
    workoutExercises: TrackedWorkoutExercise[];
}

export default function ByExercise({
    workout, performedSessions,
    selectedExerciseId, workoutExercises
}: Props) {
    const { exercises } = useExercisesContext();
    type StatField = "sets" | "target" | "weight" | "rest";
    const higherIsBetter: Record<StatField, boolean> = {
        sets: true,
        target: true,
        weight: true,
        rest: false,
    };

    const exercise = exercises.find(
        e => e.id === workoutExercises.find(ex => ex.id === selectedExerciseId)?.exerciseId
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

    function getRelevantFields(entries: PerformedExercise[]): StatField[] {
        const fields: StatField[] = ["sets", "target", "weight", "rest"];
        return fields.filter(field => entries.some(e => e[field] > 0));
    }

    function getSummaryFromValues(values: number[], higherIsBetterFlag: boolean) {
        const current = values[0];
        const first = values[values.length - 1];
        const best = higherIsBetterFlag ? Math.max(...values) : Math.min(...values);
        const worst = higherIsBetterFlag ? Math.min(...values) : Math.max(...values);
        return { first, current, best, worst, isAtBest: current === best };
    }
    function getProgressSummary(entries: PerformedExercise[], field: StatField) {
        return getSummaryFromValues(entries.map(e => e[field]), higherIsBetter[field]);
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
    const volumeSummary = getSummaryFromValues(volumeValues, true); // объём — выше всегда лучше
    const showVolume = volumeSummary.best !== volumeSummary.worst;

    function renderDelta(current: number, first: number, best: number, isAtBest: boolean, unit: string, higherIsBetterFlag: boolean) {
        const percentChange = getPercentChange(current, first);
        const isImprovement = percentChange !== null
            && (higherIsBetterFlag ? percentChange >= 0 : percentChange <= 0);
        return (
            <>
                <p className={styles.exerciseStatDelta}>
                    {percentChange !== null && (
                        <span className={isImprovement ? styles.positive : styles.negative}>
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
            {
                <p className={styles.exerciseSessionsAmount}>
                    {`${sessionEntries.length} session${sessionEntries.length > 1 ? "s" : ""} logged`}
                </p>
            }
            {
                (relevantFields.length || showVolume)
                && <ul className={styles.exerciseStatList}>
                    {
                        showVolume &&
                        <li className={styles.exerciseStat} key="volume">
                            <p className={styles.exerciseStatFieldName}>Volume</p>
                            <h2 className={styles.exerciseStatCurrent}>{volumeSummary.current}{getVolumeUnit()}</h2>
                            {renderDelta(volumeSummary.current, volumeSummary.first, volumeSummary.best, volumeSummary.isAtBest, getVolumeUnit(), true)}
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
                                    {renderDelta(current, first, best, isAtBest, getFieldUnit(field), higherIsBetter[field])}
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
