import { useState, useEffect } from "react";
import { db } from '../db'
import type { WorkoutTemplate, Workout } from "../types";

export function useTemplates() {
    const [templates, setTemplates] = useState<WorkoutTemplate[]>([])

    useEffect(() => {
        db.templates.toArray().then(setTemplates)
    }, [])

    const saveAsTemplate = async (workout: Workout): Promise<WorkoutTemplate> => {
        const template: WorkoutTemplate = {
            id: crypto.randomUUID(),
            name: workout.name,
            exercises: workout.exercises.map(e => {
                const completedSets = e.sets.filter(s => s.completed)
                const lastSet = completedSets[completedSets.length - 1]

                return {
                    exerciseId: e.exerciseId,
                    exerciseName: e.exerciseName,
                    defaultSets: completedSets.length || 3,
                    defaultWeight: lastSet?.weight ?? 20,
                    defaultReps: lastSet?.reps ?? 10,
                }
            })
        }

        await db.templates.add(template)
        setTemplates(prev => [...prev, template])
        return template
    }

    const createFromTemplate = async (
        template: WorkoutTemplate,
        createWorkout: (name: string) => Promise<Workout>,
        addSet: (workoutId: string, exerciseId: string, weight: number, reps: number) => Promise<void>,
        addExercise: (workoutId: string, exerciseId: string, name: string) => Promise<void>
    ) : Promise<Workout> => {
        const workout = await createWorkout(template.name)

        for (const ex of template.exercises) {
            await addExercise(workout.id, ex.exerciseId, ex.exerciseName)

            for (let i = 0; i < ex.defaultSets; i++) {
                await addSet(workout.id, ex.exerciseId, ex.defaultWeight, ex.defaultReps)
            }
        }

        return workout
    }

    const deleteTemplate = async (id: string) => {
        await db.templates.delete(id)
        setTemplates(prev => prev.filter(t => t.id !== id ))
    }

    return { templates, saveAsTemplate, createFromTemplate, deleteTemplate }
}