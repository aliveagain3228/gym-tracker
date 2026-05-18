export interface Set {
    id: string
    weight: number
    reps: number
    completed: boolean
    rpe?: number
}

export interface WorkoutExercise {
    id: string
    exerciseId: string
    exerciseName: string
    sets: Set[]
    notes?: string
}

export interface Workout {
    id: string
    date: string
    name: string
    exercises: WorkoutExercise[]
    duration?: number
    notes?: string
    completed: boolean
}

export interface Exercise {
    id: string
    name: string
    muscleGroup: MuscleGroup
    equipment: Equipment
    description?: string
}

export type MuscleGroup =
    | 'chest'
| 'back'
| 'shoulders'
| 'biceps'
| 'triceps'
| 'legs'
| 'core'
| 'fullBody'

export type Equipment =
    | 'barbell'
| 'dumbbell'
| 'machine'
| 'cable'
| 'bodyweight'
| 'other'

export const MUSCLE_GROUP_CONFIG: Record<MuscleGroup, { label: string, emoji: string}> = {
    chest: { label: 'Chest', emoji: '💪'},
    back: { label: 'Back', emoji: '🔙'},
    shoulders: { label: 'Shoulders', emoji: '🏋️'},
    biceps: { label: 'Biceps', emoji: '💪'},
    triceps: { label: 'Triceps', emoji: '💪'},
    legs: { label: 'Legs', emoji: '🦵'},
    core: { label: 'Core', emoji: '🎯'},
    fullBody: { label: 'Full Body', emoji: '⚡'},
}

export const EQUIPMENT_CONFIG: Record<Equipment, { label: string, emoji: string}> = {
    barbell: { label: 'Barbell', emoji: '🏋️'},
    dumbbell: { label: 'Dumbbell', emoji: '🔵'},
    machine: { label: 'Machine', emoji: '⚙️'},
    cable: { label: 'Cable', emoji: '〰️'},
    bodyweight: { label: 'Bodyweight', emoji: '🤸'},
    other: { label: 'Other', emoji: '📦'},
}