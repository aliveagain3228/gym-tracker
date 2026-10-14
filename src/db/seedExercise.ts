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
            name: '1. Понедельник: Грудь + Трицепс',
            exercises: [
                { exerciseId: 'bench-press', exerciseName: 'Жим штанги лёжа (Пирамида)', defaultSets: 7, defaultWeight: 85, defaultReps: 6 },
                { exerciseId: 'incline-db-press', exerciseName: 'Жим гантелей на наклонной скамье', defaultSets: 4, defaultWeight: 28, defaultReps: 10 },
                { exerciseId: 'upper-chest-db-raise', exerciseName: 'Подъём гантелей на верх груди наискосок', defaultSets: 3, defaultWeight: 12, defaultReps: 12 },
                { exerciseId: 'incline-db-flyes', exerciseName: 'Разводка гантелей на наклонной скамье', defaultSets: 3, defaultWeight: 14, defaultReps: 12 },
                { exerciseId: 'pullover-db', exerciseName: 'Пуловер с гантелью лёжа', defaultSets: 3, defaultWeight: 24, defaultReps: 10 },
                { exerciseId: 'close-grip-bench-press', exerciseName: 'Жим штанги узким хватом (Пирамида)', defaultSets: 7, defaultWeight: 60, defaultReps: 8 },
                { exerciseId: 'cable-pushdown', exerciseName: 'Разгибание рук на верхнем блоке V-рукоять', defaultSets: 4, defaultWeight: 40, defaultReps: 12 }
            ]
        },
        {
            id: 'template-wednesday',
            name: '2. Среда: Спина + Объёмный Бицепс',
            exercises: [
                { exerciseId: 'db-row', exerciseName: 'Тяга гантели одной рукой (Пирамида)', defaultSets: 7, defaultWeight: 30, defaultReps: 8 },
                { exerciseId: 'lat-pulldown', exerciseName: 'Тяга верхнего блока к груди', defaultSets: 4, defaultWeight: 60, defaultReps: 10 },
                { exerciseId: 'scott-bench-curl', exerciseName: 'Сгибания на скамье Скотта (EZ-гриф)', defaultSets: 4, defaultWeight: 32, defaultReps: 10 },
                { exerciseId: 'hammer-curl', exerciseName: 'Молотковые сгибания («Молотки»)', defaultSets: 4, defaultWeight: 16, defaultReps: 10 },
                { exerciseId: 'incline-db-curl', exerciseName: 'Сгибания с гантелями на наклонной 60°', defaultSets: 4, defaultWeight: 10, defaultReps: 10 },
                { exerciseId: 'reverse-curl', exerciseName: 'Подъём штанги обратным хватом', defaultSets: 4, defaultWeight: 25, defaultReps: 12 }
            ]
        },
        {
            id: 'template-friday',
            name: '3. Пятница: Плечи, Трапеция, Ноги (Без рук)',
            exercises: [
                { exerciseId: 'db-shoulder-press', exerciseName: 'Жим гантелей сидя (Пирамида)', defaultSets: 7, defaultWeight: 22, defaultReps: 8 },
                { exerciseId: 'lateral-front-raise', exerciseName: 'Махи в стороны со сведением перед собой', defaultSets: 4, defaultWeight: 10, defaultReps: 12 },
                { exerciseId: 'shrugs', exerciseName: 'Шраги с гантелями стоя', defaultSets: 4, defaultWeight: 26, defaultReps: 12 },
                { exerciseId: 'hip-thrust', exerciseName: 'Ягодичный мостик со штангой', defaultSets: 4, defaultWeight: 50, defaultReps: 12 },
                { exerciseId: 'deadlift', exerciseName: 'Становая тяга со штангой', defaultSets: 4, defaultWeight: 70, defaultReps: 10 },
                { exerciseId: 'bodyweight-squat-support', exerciseName: 'Приседания у опоры без отягощения', defaultSets: 3, defaultWeight: 0, defaultReps: 15 },
                { exerciseId: 'leg-extension', exerciseName: 'Разгибание ног в тренажёре сидя', defaultSets: 4, defaultWeight: 50, defaultReps: 12 },
                { exerciseId: 'leg-curl', exerciseName: 'Сгибание ног в тренажёре лёжа', defaultSets: 3, defaultWeight: 40, defaultReps: 12 },
                { exerciseId: 'calf-raise', exerciseName: 'Подъёмы на носки на платформе', defaultSets: 4, defaultWeight: 18, defaultReps: 15 }
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