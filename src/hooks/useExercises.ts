import { useState, useEffect } from "react";
import { db } from "../db";
import type { Exercise, MuscleGroup } from "../types";
import { fetchExercisesFromAPI } from "../db/exerciseDbService.ts";

export function useExercises() {
    const [exercises, setExercises] = useState<Exercise[]>([])

    useEffect(() => {
        async function loadData() {
            try {
                const apiExercises = await fetchExercisesFromAPI()

                if(apiExercises && apiExercises.length > 0) {
                    setExercises(apiExercises)

                    await db.exercises.clear()
                    await db.exercises.bulkAdd(apiExercises)
                    return
                }
            } catch {
                console.log("Нет интернета, загружаем из локального кэша базы данных...")
            }

            const localExercises = await db.exercises.toArray()
            setExercises(localExercises)
        }

        loadData()

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
