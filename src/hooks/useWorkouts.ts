import { useState, useEffect } from "react";
import { db } from '../db'
import { seedExerciseIfEmpty } from "../db/seedExercise.ts";
import type { Workout, WorkoutExercise, Set } from "../types";

export function useWorkouts() {
    const [workouts, setWorkouts] = useState<Workout[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const init = async () => {
            await seedExerciseIfEmpty()

            const all = await db.workouts
                .orderBy('date')
                .reverse()
                .toArray()

            setWorkouts(all)
            setLoading(false)
        }

        init()
    }, [])

    const createWorkout = async (name: string): Promise<Workout> => {
        const workout: Workout = {
            id: crypto.randomUUID(),
            date: new Date().toISOString().split('T')[0],
            name,
            exercises: [],
            completed: false,
        }

        await db.workouts.add(workout)

        setWorkouts(prev => [workout, ...prev])

        return workout
    }

    const addExercise = async (workoutId: string, exerciseId: string, exerciseName: string) => {
        const newExercise: WorkoutExercise = {
            id: crypto.randomUUID(),
            exerciseId,
            exerciseName,
            sets: [],
        }

        await db.workouts
            .where('id').equals(workoutId)
            .modify(workout => {
                workout.exercises.push(newExercise)
            })

        setWorkouts(prev => prev.map(w =>
            w.id === workoutId
                ? {...w, exercises: [...w.exercises, newExercise]}
                : w
        ))
    }

    const addSet = async (workoutId: string, exerciseId: string, weight: number, reps: number) => {
        const newSet: Set = {
            id: crypto.randomUUID(),
            weight,
            reps,
            completed: false,
        }
        await db.workouts
            .where('id').equals(workoutId)
            .modify(workout => {
                const exercise = workout.exercises.find(e => e.id === exerciseId)
                if (exercise) exercise.sets.push(newSet)
            })

        setWorkouts(prev => prev.map(w => {
            if (w.id !== workoutId) return w
            return {
                ...w,
                exercises: w.exercises.map(e => {
                    if (e.id !== exerciseId) return e
                    return {...e, sets: [...e.sets, newSet]}
                })
            }
        }))
    }

    const toggleSet = async (workoutId: string, exerciseId: string, setId: string) => {
        await db.workouts
            .where('id').equals(workoutId)
            .modify(workout => {
                const exercise = workout.exercises.find(e => e.id === exerciseId)
                const set = exercise?.sets.find(s => s.id === setId)
                if (set) set.completed = !set.completed
            })
        setWorkouts(prev => prev.map(w => {
            if (w.id !== workoutId) return w
            return {
                ...w,
                exercises: w.exercises.map(e => {
                    if (e.id !== exerciseId) return e
                    return {
                        ...e,
                        sets: e.sets.map(s =>
                            s.id === setId ? {...s, completed: !s.completed} : s
                        )
                    }
                })
            }
        }))
    }

    const updateSet = async (workoutId: string, exerciseId: string, setId: string, weight: number, reps: number) => {
        await db.workouts
            .where('id').equals(workoutId)
            .modify(workout => {
                const exercise = workout.exercises.find(e => e.id === exerciseId)
                const set = exercise?.sets.find(s => s.id === setId)
                if (set) {
                    set.weight = weight
                    set.reps = reps
                }
            })

        setWorkouts(prev => prev.map(w => {
            if (w.id !== workoutId) return w
            return {
                ...w,
                exercises: w.exercises.map(e => {
                    if (e.id !== exerciseId) return e
                    return {
                        ...e,
                        sets: e.sets.map(s =>
                            s.id === setId ? {...s, weight, reps} : s
                        )
                    }
                })
            }
        }))
    }

    const completeWorkout = async (workoutId: string, duration: number) => {
        await db.workouts
            .where('id').equals(workoutId)
            .modify(w => {
                w.completed = true
                w.duration = duration
            })

        setWorkouts(prev => prev.map(w =>
            w.id === workoutId ? {...w, completed: true, duration} : w
        ))
    }

    const deleteWorkout = async (workoutId: string) => {
        await db.workouts.delete(workoutId)
        setWorkouts(prev => prev.filter(w => w.id !== workoutId))
    }

    return {
        workouts,
        loading,
        createWorkout,
        addExercise,
        addSet,
        toggleSet,
        updateSet,
        completeWorkout,
        deleteWorkout,
    }
}