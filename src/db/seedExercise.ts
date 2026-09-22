import { db } from "./index.ts";
import { fetchExercisesFromAPI } from "./exerciseDbService.ts";

const EXERCISES_LOADED_KEY = 'gym_tracker_api_loaded_v9'

async function seedTemplates(): Promise<void> {
    const templateCount = await db.templates.count()
    if (templateCount > 0) {
        await db.templates.clear()
    }

    const defaultTemplates = [
        {
            id: 'template-monday',
            name: '1. Понедельник: Грудь, Плечи, Пресс',
            exercises: [
                { exerciseId: 'bench-press', exerciseName: 'Жим штанги лёжа', defaultSets: 4, defaultWeight: 60, defaultReps: 8 },
                { exerciseId: 'incline-db-press', exerciseName: 'Жим гантелей на наклонной', defaultSets: 3, defaultWeight: 22, defaultReps: 10 },
                { exerciseId: 'pullover-db', exerciseName: 'Пуловер с гантелью', defaultSets: 3, defaultWeight: 18, defaultReps: 12 },
                { exerciseId: 'ohp', exerciseName: 'Жим штанги с груди стоя', defaultSets: 3, defaultWeight: 40, defaultReps: 8 },
                { exerciseId: 'lateral-raise', exerciseName: 'Махи гантелями в стороны', defaultSets: 3, defaultWeight: 10, defaultReps: 12 },
                { exerciseId: 'hanging-leg-raise', exerciseName: 'Подъём ног в висе (или лежа)', defaultSets: 3, defaultWeight: 0, defaultReps: 15 },
                { exerciseId: 'crunch', exerciseName: 'Скручивания на пресс', defaultSets: 3, defaultWeight: 0, defaultReps: 20 }
            ]
        },
        {
            id: 'template-wednesday',
            name: '2. Среда: Спина, Руки, Пресс',
            exercises: [
                { exerciseId: 'barbell-row', exerciseName: 'Тяга штанги в наклоне', defaultSets: 4, defaultWeight: 50, defaultReps: 10 },
                { exerciseId: 'db-row', exerciseName: 'Тяга гантели к поясу', defaultSets: 3, defaultWeight: 24, defaultReps: 12 },
                { exerciseId: 'barbell-curl', exerciseName: 'Подъём штанги на бицепс', defaultSets: 3, defaultWeight: 30, defaultReps: 12 },
                { exerciseId: 'french-press', exerciseName: 'Французский жим', defaultSets: 3, defaultWeight: 25, defaultReps: 12 },
                { exerciseId: 'reverse-curl', exerciseName: 'Подъём штанги ОБРАТНЫМ хватом', defaultSets: 3, defaultWeight: 20, defaultReps: 12 },
                { exerciseId: 'cable-pushdown', exerciseName: 'Разгибание рук в станке стоя', defaultSets: 3, defaultWeight: 40, defaultReps: 12 },
                { exerciseId: 'plank', exerciseName: 'Планка', defaultSets: 3, defaultWeight: 0, defaultReps: 1 }
            ]
        },
        {
            id: 'template-friday',
            name: '3. Пятница: Ноги, Предплечья, Пресс',
            exercises: [
                { exerciseId: 'squat', exerciseName: 'Приседания со штангой', defaultSets: 4, defaultWeight: 70, defaultReps: 10 },
                { exerciseId: 'leg-curl', exerciseName: 'Сгибание ног в станке', defaultSets: 3, defaultWeight: 35, defaultReps: 15 },
                { exerciseId: 'leg-extension', exerciseName: 'Разгибание ног в станке', defaultSets: 3, defaultWeight: 40, defaultReps: 15 },
                { exerciseId: 'deadlift', exerciseName: 'Становая тяга со штангой', defaultSets: 3, defaultWeight: 80, defaultReps: 10 },
                { exerciseId: 'wrist-curl-seated', exerciseName: 'Сгибание кистей со штангой', defaultSets: 3, defaultWeight: 20, defaultReps: 15 },
                { exerciseId: 'wrist-ext-db', exerciseName: 'Разгибание кистей с гантелями', defaultSets: 3, defaultWeight: 8, defaultReps: 15 },
                { exerciseId: 'sit-up', exerciseName: 'Подъём корпуса лёжа', defaultSets: 3, defaultWeight: 0, defaultReps: 15 },
                { exerciseId: 'oblique-crunch', exerciseName: 'Боковые скручивания', defaultSets: 3, defaultWeight: 0, defaultReps: 20 }
            ]
        }
    ]

    await db.templates.bulkPut(defaultTemplates)
}

export async function seedExerciseIfEmpty(): Promise<void> {
    if (localStorage.getItem(EXERCISES_LOADED_KEY) === 'true') return

    const count = await db.exercises.count()

    if (count > 0) {
        console.log('🔄 Очищаю старую базу перед заполнением новой версии...')
        await db.exercises.clear()
    }

    try {
        const exercises = await fetchExercisesFromAPI()

        if (exercises.length > 0) {
            await db.exercises.bulkPut(exercises)
            await seedTemplates()

            localStorage.setItem(EXERCISES_LOADED_KEY, 'true')
            console.log(`✅ База Dexie успешно заполнена (${exercises.length} упражнений)`)
            return
        }
    } catch (error) {
        console.warn('❌ Ошибка при первичном заполнении базы:', error)
    }
}
    export async function refreshExercisesFromAPI(): Promise<void> {
        localStorage.removeItem(EXERCISES_LOADED_KEY)
        await db.exercises.clear()
        await db.templates.clear()
        await seedExerciseIfEmpty()
    }