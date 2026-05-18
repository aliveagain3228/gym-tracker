import { useState, useEffect } from "react";
import { db } from "../db";
import type { Exercise, MuscleGroup } from "../types";

export function useExercises() {
    const [exercises, setExercises] = useState<Exercise[]>([])

    useEffect(() => {
        db.exercises.toArray().then(setExercises)

    }, [])

    const getByMuscleGroup = (group: MuscleGroup): Exercise[] => {
        return exercises.filter(e => e.muscleGroup === group)
    }

    const searchExercises = (query: string): Exercise[] => {
        if (!query.trim()) return exercises
        const lower = query.toLowerCase()
        return exercises.filter(e => e.name.toLowerCase().includes(lower))
    }


    const addCustomExercise = async (data: Omit<Exercise, 'id'>): Promise<Exercise> => {
        const exercise: Exercise = {
            ...data,
            id: crypto.randomUUID(),
        }

        await db.exercises.add(exercise)
        setExercises(prev => [...prev, exercise])
        return exercise
    }
    return {exercises, getByMuscleGroup, searchExercises, addCustomExercise}

}
