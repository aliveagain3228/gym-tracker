import { db } from "./indext.ts";
import type { Exercise } from "../types";

const DEFAULT_EXERCISES: Exercise[] = [
    { id: 'bench-press', name: 'Bench Press', muscleGroup: 'chest', equipment: 'barbell'  },
    { id: 'incline-press', name: 'Incline Press', muscleGroup: 'chest', equipment: 'dumbbell' },
    { id: 'cable-crossover', name: 'Cable Crossover', muscleGroup: 'chest', equipment: 'cable' },
    { id: 'deadlift', name: 'Deadlift', muscleGroup: 'back', equipment: 'barbell' },
    { id: 'pullup', name: 'Pull-up', muscleGroup: 'back', equipment: 'bodyweight' },
    { id: 'barbell-row', name: 'Barbell Row', muscleGroup: 'back', equipment: 'barbell' },
    { id: 'lat-pulldown', name: 'Lat Pulldown', muscleGroup: 'back', equipment: 'cable' },
    { id: 'ohp', name: 'Overhead Press', muscleGroup: 'shoulders', equipment: 'barbell' },
    { id: 'lateral-raise', name: 'Lateral Raise', muscleGroup: 'shoulders', equipment: 'dumbbell' },
    { id: 'squat', name: 'Back Squat', muscleGroup: 'legs', equipment: 'barbell' },
    { id: 'leg-press', name: 'Leg Press', muscleGroup: 'legs', equipment: 'machine' },
    { id: 'romanian-deadlift', name: 'Romanian Deadlift', muscleGroup: 'legs', equipment: 'barbell' },
    { id: 'barbell-curl', name: 'Barbell Curl', muscleGroup: 'biceps', equipment: 'barbell' },
    { id: 'hammer-curl', name: 'Hammer Curl', muscleGroup: 'biceps', equipment: 'dumbbell' },
    { id: 'triceps-pushdown', name: 'Triceps Pushdown', muscleGroup: 'triceps', equipment: 'cable' },
    { id: 'skull-crusher', name: 'Skull Crusher', muscleGroup: 'triceps', equipment: 'barbell' },
    { id: 'plank', name: 'Plank', muscleGroup: 'core', equipment: 'bodyweight' },
]

export async function seedExerciseIfEmpty() {
    const count = await db.exercise.count()

    if(count === 0) {
        await db.exercise.bulkAdd(DEFAULT_EXERCISES)
        console.log('Exercises seeded!')
    }
}