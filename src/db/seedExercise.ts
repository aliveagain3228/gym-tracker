import { db } from "./index.ts";
import type { Exercise } from "../types";
import { fetchExercisesFromAPI } from "./exerciseDbService.ts";

const EXERCISES_LOADED_KEY = 'gym_tracker_api_loaded_v5'

const FALLBACK_EXERCISES: Exercise[] = [

    { id: 'bench-press',        name: 'Жим штанги лёжа',              muscleGroup: 'chest',     equipment: 'barbell',    description: '4 × 6–8. Базовое упражнение для груди. Опускай штангу к середине груди, локти 45°.' },
    { id: 'incline-db-press',   name: 'Жим гантелей на наклонной',    muscleGroup: 'chest',     equipment: 'dumbbell',   description: '3 × 10–12. Верх грудных. Наклон скамьи 30–45°.' },
    { id: 'pullover-db',        name: 'Пуловер с гантелью',           muscleGroup: 'chest',     equipment: 'dumbbell',   description: '3 × 12–15. Выполняйте лежа поперек скамьи, делайте глубокий вдох на опускании.' },
    { id: 'ohp',                name: 'Жим штанги с груди стоя',      muscleGroup: 'shoulders', equipment: 'barbell',    description: '3 × 8–10. База для дельт. Выжимай строго вверх, не отклоняйся.' },
    { id: 'lateral-raise',      name: 'Махи гантелями в стороны',     muscleGroup: 'shoulders', equipment: 'dumbbell',   description: '3 × 12–15. Средние дельты. Поднимай до уровня плеч.' },
    { id: 'hanging-leg-raise',  name: 'Подъём ног в висе (или лежа)', muscleGroup: 'core',      equipment: 'bodyweight', description: '3 × 15–20. Нижний пресс. Поднимай ноги до 90° без раскачки.' },
    { id: 'crunch',             name: 'Скручивания на пресс',         muscleGroup: 'core',      equipment: 'bodyweight', description: '3 × 20. Верхний пресс. Отрывай только лопатки.' },

    { id: 'barbell-row',        name: 'Тяга штанги в наклоне',        muscleGroup: 'back',      equipment: 'barbell',    description: '4 × 8–10. Толщина спины. Тяни к низу живота, наклон 45°.' },
    { id: 'db-row',             name: 'Тяга гантели к поясу',         muscleGroup: 'back',      equipment: 'dumbbell',   description: '3 × 10–12. Широчайшие. Опирайся коленом на скамью.' },
    { id: 'barbell-curl',       name: 'Подъём штанги на бицепс',      muscleGroup: 'biceps',    equipment: 'barbell',    description: '3 × 10–12. Масса бицепса. Хват прямой средний. Локти прижаты.' },
    { id: 'french-press',       name: 'Французский жим',              muscleGroup: 'triceps',   equipment: 'barbell',    description: '3 × 10–12. Длинная головка трицепса. Локти неподвижны.' },
    { id: 'reverse-curl',       name: 'Подъём штанги ОБРАТНЫМ хватом',muscleGroup: 'biceps',    equipment: 'barbell',    description: '3 × 12. Развивает плечелучевую мышцу и предплечья.' },
    { id: 'cable-pushdown',     name: 'Разгибание рук в станке стоя', muscleGroup: 'triceps',   equipment: 'machine',    description: 'Изоляция трицепса. Локти прижаты, разгибай полностью.' },
    { id: 'plank',              name: 'Планка',                       muscleGroup: 'core',      equipment: 'bodyweight', description: '3 подхода по 1 минуте. Статика для кора. Тело ровное, не прогибайся.' },

    { id: 'squat',              name: 'Приседания со штангой',        muscleGroup: 'legs',      equipment: 'barbell',    description: '4 × 8–10. Король упражнений. До параллели, спина прямая.' },
    { id: 'leg-curl',           name: 'Сгибание ног в станке',        muscleGroup: 'legs',      equipment: 'machine',    description: '3 × 12–15. Бицепс бедра. Не отрывай таз от скамьи.' },
    { id: 'leg-extension',      name: 'Разгибание ног в станке',      muscleGroup: 'legs',      equipment: 'machine',    description: '3 × 12–15. Квадрицепс. Разгибай полностью.' },
    { id: 'deadlift',           name: 'Становая тяга со штангой',     muscleGroup: 'back',      equipment: 'barbell',    description: '3 × 10–12. Спина прямая, штангу веди вдоль голеней.' },
    { id: 'wrist-curl-seated',  name: 'Сгибание кистей со штангой',   muscleGroup: 'biceps',    equipment: 'barbell',    description: '3 × 15–20. Выполняется сидя. Развитие внутренней части предплечий.' },
    { id: 'wrist-ext-db',       name: 'Разгибание кистей с гантелями',muscleGroup: 'biceps',    equipment: 'dumbbell',   description: '3 × 15–20. Развитие внешней (тыльной) части предплечий.' },
    { id: 'sit-up',             name: 'Подъём корпуса лёжа',          muscleGroup: 'core',      equipment: 'bodyweight', description: '3 × 15. Руки на затылок. Полное скручивание к коленям.' },
    { id: 'oblique-crunch',     name: 'Боковые скручивания',          muscleGroup: 'core',      equipment: 'bodyweight', description: '3 × 20 на каждую сторону. Акцент на косые мышцы живота.' }
]

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
        console.log('🔄 Обновляю базу данных до версии v5...')
        await db.exercises.clear()
    }

    try {
        const exercises = await fetchExercisesFromAPI()

        if (exercises.length > 0) {
            await db.exercises.bulkPut(exercises)
            await db.exercises.bulkPut(FALLBACK_EXERCISES)

            await seedTemplates()

            localStorage.setItem(EXERCISES_LOADED_KEY, 'true')
            console.log(`✅ Загружено ${exercises.length} упражнений и шаблоны обновлены`)
            return
        }
    } catch {
        console.warn('⚠️ exercises.json не найден, используем встроенный список')
    }

    await db.exercises.bulkPut(FALLBACK_EXERCISES)
    await seedTemplates()

    localStorage.setItem(EXERCISES_LOADED_KEY, 'true')
    console.log(`✅ Загружены базовые упражнения и созданы шаблоны программ`)
}

export async function refreshExercisesFromAPI(): Promise<void> {
    localStorage.removeItem(EXERCISES_LOADED_KEY)
    await db.exercises.clear()
    await db.templates.clear()
    await seedExerciseIfEmpty()
}