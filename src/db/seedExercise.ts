import { db } from "./index.ts";
import type { Exercise } from "../types";
import { fetchExercisesFromAPI } from "./exerciseDbService.ts";

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
    const count = await db.exercises.count()

    if(count > 0) return
    console.log('📦 База упражнений пуста. Начинаю инициализацию...')

    try {
        const exercises = await fetchExercisesFromAPI()

        if(exercises.length > 0) {
            await db.exercises.bulkAdd(exercises)
            console.log(`✅ Загружено из API: ${exercises.length} упражнений`)
            return
        }
    } catch (error) {
        console.warn('⚠️ API недоступен, загружаю локальные упражнения:', error)
    }

    await db.exercises.bulkAdd(FALLBACK_EXERCISES)
    console.log(`✅ Загружено локально: ${FALLBACK_EXERCISES.length} упражнений`)
}

export async function refreshExercisesFromAPI(): Promise<void> {
    console.log('🔄 Обновляю упражнения из API...')
    await db.exercises
        .filter(ex => ex.id.startsWith('edb_'))
        .delete()

    try {
        const exercises = await fetchExercisesFromAPI()
        await db.exercises.bulkAdd(exercises)
        console.log(`✅ Обновлено: ${exercises.length} упражнений`)
    } catch (error) {
        console.error('❌ Ошибка обновления:', error)
        throw error
    }
}