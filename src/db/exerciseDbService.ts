import type { Exercise, MuscleGroup, Equipment } from "../types";

interface ExerciseDBExercise {
    id: string
    name: string
    bodyPart: string
    equipment: string
    target: string
    gifUrl: string
    instructions: string[]
}

const BODY_PART_MAP: Record<string, MuscleGroup> = {
    'chest': 'chest',
    'back' : 'back',
    'shoulders' : 'shoulders',
    'upper arms' : 'biceps',
    'lower arms' : 'biceps',
    'upper legs' : 'legs',
    'lower legs' : 'legs',
    'waist' : 'core',
    'cardio' : 'fullBody',
    'neck' : 'fullBody',
}

const TARGET_MUSCLE_MAP: Record<string, MuscleGroup> = {
    'biceps': 'biceps',
    'triceps': 'triceps',
}

const EQUIPMENT_MAP: Record<string, Equipment> = {
    'barbell': 'barbell',
    'dumbbell': 'dumbbell',
    'cable': 'cable',
    'machine': 'machine',
    'body weight': 'bodyweight',
    'assisted': 'bodyweight',
    'resistance band': 'other',
    'bosu ball': 'other',
    'band': 'other',
    'kettlebell': 'dumbbell',
    'roller': 'other',
    'stability ball': 'other',
    'weighted': 'other',
    'olympic barbell': 'barbell',
    'ez barbell': 'barbell',
    'trap bar': 'barbell',
}

function convertExercise(ex: ExerciseDBExercise): Exercise {

    const muscleGroup: MuscleGroup =
        TARGET_MUSCLE_MAP[ex.target] ??
        BODY_PART_MAP[ex.bodyPart] ??
        'fullBody'

    const equipment: Equipment = (EQUIPMENT_MAP[ex.equipment] ?? 'other') as Equipment

    const description = ex.instructions
        .map((step, i) => `${i + 1}.${step}`)
    .join('\n')

    return {
        id: `edb_${ex.id}`,
        name: ex.name,
        muscleGroup,
        equipment,
        description,
        tutorialGif: ex.gifUrl,
        previewImage:ex.gifUrl,
    }
}

const API_BASE = 'https://exercisedb.dev/api/v1'

async function fetchBodyPart(bodyPart: string, limit = 50): Promise<ExerciseDBExercise[]> {
    const url = `${API_BASE}/exercises/bodyPart/${bodyPart}?limit=${limit}&offset=0`
    const response = await fetch(url)

    if (!response.ok) {
        console.warn(`⚠️ Не удалось загрузить упражнения для: ${bodyPart}`)
        return []
    }

    const data = await response.json()
    const list = data.exercises ?? data
    return Array.isArray(list) ? list : []
}

export async function fetchExercisesFromAPI(): Promise<Exercise[]> {
    console.log('🌐 Загружаю упражнения из ExerciseDB API...')

    const bodyPartsToFetch = [
        'chest', 'back', 'shoulders', 'upper arms', 'lower arms', 'upper legs', 'lower legs', 'waist',
    ]
    const results = await Promise.all(
        bodyPartsToFetch.map(part => fetchBodyPart(part))
    )

    const allExercises = results.flat()

    const converted = allExercises.map(convertExercise)
    const unique = Array.from(
        new Map(converted.map(ex => [ex.id, ex])).values()
    )

    console.log(`✅ Загружено ${unique.length} упражнений из API`)
    return unique
}