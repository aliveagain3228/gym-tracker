import { db } from "./index.ts";
import type { Exercise } from "../types";
import { fetchExercisesFromAPI } from "./exerciseDbService.ts";

const EXERCISES_LOADED_KEY = 'gym_tracker_api_loaded_v3'

const FALLBACK_EXERCISES: Exercise[] = [
    { id: 'bench-press',        name: 'Жим штанги лёжа',              muscleGroup: 'chest',     equipment: 'barbell',    description: 'Базовое упражнение для груди. Опускай штангу к середине груди, локти 45°.' },
    { id: 'incline-db-press',   name: 'Жим гантелей на наклонной',    muscleGroup: 'chest',     equipment: 'dumbbell',   description: 'Верх грудных. Наклон скамьи 30–45°.' },
    { id: 'ohp',                name: 'Жим штанги с груди стоя',      muscleGroup: 'shoulders', equipment: 'barbell',    description: 'База для дельт. Выжимай строго вверх, не отклоняйся.' },
    { id: 'lateral-raise',      name: 'Махи гантелями в стороны',     muscleGroup: 'shoulders', equipment: 'dumbbell',   description: 'Средние дельты. Поднимай до уровня плеч.' },
    { id: 'barbell-row',        name: 'Тяга штанги в наклоне',        muscleGroup: 'back',      equipment: 'barbell',    description: 'Толщина спины. Тяни к низу живота, наклон 45°.' },
    { id: 'db-row',             name: 'Тяга гантели к поясу',         muscleGroup: 'back',      equipment: 'dumbbell',   description: 'Широчайшие. Опирайся коленом на скамью.' },
    { id: 'barbell-curl',       name: 'Подъём штанги на бицепс',      muscleGroup: 'biceps',    equipment: 'barbell',    description: 'Масса бицепса. Локти прижаты, не раскачивайся.' },
    { id: 'french-press',       name: 'Французский жим',              muscleGroup: 'triceps',   equipment: 'barbell',    description: 'Длинная головка трицепса. Локти неподвижны.' },
    { id: 'cable-pushdown',     name: 'Разгибание рук в блоке',       muscleGroup: 'triceps',   equipment: 'cable',      description: 'Изоляция трицепса. Локти прижаты, разгибай полностью.' },
    { id: 'squat',              name: 'Приседания со штангой',        muscleGroup: 'legs',      equipment: 'barbell',    description: 'Король упражнений. До параллели, спина прямая.' },
    { id: 'deadlift',           name: 'Становая тяга',                muscleGroup: 'legs',      equipment: 'barbell',    description: 'Спина прямая, штангу веди вдоль голеней.' },
    { id: 'leg-curl',           name: 'Сгибание ног в станке',        muscleGroup: 'legs',      equipment: 'machine',    description: 'Бицепс бедра. Не отрывай таз от скамьи.' },
    { id: 'leg-extension',      name: 'Разгибание ног в станке',      muscleGroup: 'legs',      equipment: 'machine',    description: 'Квадрицепс. Разгибай полностью, контролируй опускание.' },
    { id: 'hanging-leg-raise',  name: 'Подъём ног в висе',            muscleGroup: 'core',      equipment: 'bodyweight', description: 'Нижний пресс. Поднимай ноги до 90° без раскачки.' },
    { id: 'plank',              name: 'Планка',                       muscleGroup: 'core',      equipment: 'bodyweight', description: 'Статика для кора. Тело ровное, не прогибайся.' },
    { id: 'crunch',             name: 'Скручивания на пресс',         muscleGroup: 'core',      equipment: 'bodyweight', description: 'Верхний пресс. Отрывай только лопатки.' },
]

export async function seedExerciseIfEmpty(): Promise<void> {

    if (localStorage.getItem(EXERCISES_LOADED_KEY) === 'true') return

    const count = await db.exercises.count()

    if (count > 0) {
        console.log('🔄 Обновляю упражнения...')
        await db.exercises.clear()
    } else {
        console.log('📦 Загружаю упражнения...')
    }

    try {
        const exercises = await fetchExercisesFromAPI()

        if (exercises.length > 0) {
            await db.exercises.bulkPut(exercises)
            localStorage.setItem(EXERCISES_LOADED_KEY, 'true')
            console.log(`✅ Загружено ${exercises.length} упражнений из файла`)
            return
        }
    } catch {
            console.warn('⚠️ exercises.json не найден, используем встроенный список')
        }
        await db.exercises.bulkPut(FALLBACK_EXERCISES)
        console.log(`✅ Загружено ${FALLBACK_EXERCISES.length} базовых упражнений`)
    }

    export async function refreshExercisesFromAPI(): Promise<void> {
        localStorage.removeItem(EXERCISES_LOADED_KEY)
        await db.exercises.clear()
        await seedExerciseIfEmpty()
    }
