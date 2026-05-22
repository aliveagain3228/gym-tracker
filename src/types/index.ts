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

export interface WorkoutTemplate {
    id: string
    name: string
    exercises: {
        exerciseId: string
        exerciseName: string
        defaultSets: number
        defaultWeight: number
        defaultReps: number
    }[]
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
    previewImage?: string
    tutorialGif?: string
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

export const MUSCLE_GROUP_CONFIG: Record<MuscleGroup, { label: string, icon: string}> = {
    chest: { label: 'Грудь', icon: 'Dumbbell'},
    back: { label: 'Back', icon: 'ArrowLeft'},
    shoulders: { label: 'Плечи', icon: 'Activity'},
    biceps: { label: 'Бицепс', icon: 'Flame'},
    triceps: { label: 'Трицепс', icon: 'Flame'},
    legs: { label: 'Ноги', icon: 'User'},
    core: { label: 'Пресс', icon: 'Target'},
    fullBody: { label: 'Всё тело', icon: 'Zap'},
}

export const EQUIPMENT_CONFIG: Record<Equipment, { label: string, icon: string}> = {
    barbell: { label: 'Штанга', icon: 'Dumbbell'},
    dumbbell: { label: 'Гантели', icon: 'Dumbbell'},
    machine: { label: 'Тренажёр', icon: 'Activity'},
    cable: { label: 'Блоки', icon: 'Wind'},
    bodyweight: { label: 'Свой вес', icon: 'User'},
    other: { label: 'Другое', icon: 'Target'},
}