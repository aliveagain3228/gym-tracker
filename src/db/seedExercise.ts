import { db } from "./index.ts";
import type { Exercise } from "../types";

const DEFAULT_EXERCISES: Exercise[] = [
    {
        id: 'bench-press',
        name: 'Жим штанги лёжа',
        muscleGroup: 'chest',
        equipment: 'barbell',
        description: 'Базовое упражнение для развития грудных мышц. Опускай штангу к середине груди, локти под углом 45°.',
        previewImage: 'https://media.giphy.com/media/example-bench-press.jpg',
        tutorialGif: 'https://media.giphy.com/media/example-bench-press.gif'
    },
    {
        id: 'incline-db-press',
        name: 'Жим гантелей на наклонной',
        muscleGroup: 'chest',
        equipment: 'dumbbell',
        description: 'Прорабатывает верх грудных. Наклон скамьи 30-45°, опускай гантели до растяжения.'
    },
    {
        id: 'pullover',
        name: 'Пуловер с гантелью',
        muscleGroup: 'chest',
        equipment: 'dumbbell',
        description: 'Растягивает грудную клетку. Опускай гантель за голову, держи руки слегка согнутыми.'
    },
    {
        id: 'ohp',
        name: 'Жим штанги с груди стоя',
        muscleGroup: 'shoulders',
        equipment: 'barbell',
        description: 'Базовое упражнение для дельт. Выжимай строго вверх, не отклоняйся назад.'
    },
    {
        id: 'lateral-raise',
        name: 'Махи гантелями в стороны',
        muscleGroup: 'shoulders',
        equipment: 'dumbbell',
        description: 'Изолированная работа средних дельт. Поднимай гантели до уровня плеч, локти чуть выше кистей.'
    },
    {
        id: 'hanging-leg-raise',
        name: 'Подъём ног в висе',
        muscleGroup: 'core',
        equipment: 'bodyweight',
        description: 'Мощное упражнение для нижнего пресса. Поднимай ноги до 90° без раскачки.'
    },
    {
        id: 'crunch',
        name: 'Скручивания на пресс',
        muscleGroup: 'core',
        equipment: 'bodyweight',
        description: 'Классика для верхнего пресса. Отрывай только лопатки, не тяни шею руками.'
    },
    {
        id: 'plank',
        name: 'Планка',
        muscleGroup: 'core',
        equipment: 'bodyweight',
        description: 'Статическое упражнение для всего кора. Держи тело ровно, не прогибайся в пояснице.'
    },
    {
        id: 'barbell-row',
        name: 'Тяга штанги в наклоне',
        muscleGroup: 'back',
        equipment: 'barbell',
        description: 'База для толщины спины. Наклон 45°, тяни штангу к низу живота.'
    },
    {
        id: 'db-row',
        name: 'Тяга гантели к поясу',
        muscleGroup: 'back',
        equipment: 'dumbbell',
        description: 'Односторонняя тяга для широчайших. Упирайся коленом на скамью, тяни гантель к поясу.'
    },
    {
        id: 'barbell-curl',
        name: 'Подъём штанги на бицепс',
        muscleGroup: 'biceps',
        equipment: 'barbell',
        description: 'Классика для массы бицепса. Локти прижаты к корпусу, не раскачивайся.'
    },
    {
        id: 'reverse-curl',
        name: 'Подъём штанги обратным хватом',
        muscleGroup: 'biceps',
        equipment: 'barbell',
        description: 'Прорабатывает брахиалис и предплечья. Хват ладонями вниз.'
    },
    {
        id: 'french-press',
        name: 'Французский жим',
        muscleGroup: 'triceps',
        equipment: 'barbell',
        description: 'Изоляция для длинной головки трицепса. Локти неподвижны, опускай штангу за голову.'
    },
    {
        id: 'cable-pushdown',
        name: 'Разгибание рук в станке стоя',
        muscleGroup: 'triceps',
        equipment: 'cable',
        description: 'Изоляция трицепса на блоке. Локти прижаты, разгибай руки полностью.'
    },
    {
        id: 'squat',
        name: 'Приседания со штангой',
        muscleGroup: 'legs',
        equipment: 'barbell',
        description: 'Король упражнений. Опускайся до параллели или ниже, спина прямая.'
    },
    {
        id: 'deadlift',
        name: 'Становая тяга',
        muscleGroup: 'legs',
        equipment: 'barbell',
        description: 'Базовое для всего тела. Спина прямая, штангу веди вдоль голеней.'
    },
    {
        id: 'leg-curl',
        name: 'Сгибание ног в станке',
        muscleGroup: 'legs',
        equipment: 'machine',
        description: 'Изоляция для бицепса бедра. Не отрывай таз от скамьи.'
    },
    {
        id: 'leg-extension',
        name: 'Разгибание ног в станке',
        muscleGroup: 'legs',
        equipment: 'machine',
        description: 'Изоляция квадрицепса. Разгибай ноги полностью, контролируй опускание.'
    },
    {
        id: 'wrist-curl',
        name: 'Сгибание кистей со штангой',
        muscleGroup: 'core',
        equipment: 'barbell',
        description: 'Для внутренней части предплечий. Предплечья на скамье, опускай и поднимай только кисти.'
    },
    {
        id: 'reverse-wrist-curl',
        name: 'Разгибание кистей с гантелями',
        muscleGroup: 'core',
        equipment: 'dumbbell',
        description: 'Для внешней части предплечий. Обратный хват, разгибай кисти вверх.'
    },
    {
        id: 'situp',
        name: 'Подъём корпуса лёжа',
        muscleGroup: 'core',
        equipment: 'bodyweight',
        description: 'Динамическое упражнение для пресса. Поднимай корпус полностью, можно с отягощением.'
    },
    {
        id: 'side-crunch',
        name: 'Боковые скручивания',
        muscleGroup: 'core',
        equipment: 'bodyweight',
        description: 'Для косых мышц живота. Скручивайся в сторону, чередуй стороны.'
    },
]

export async function seedExerciseIfEmpty() {
    const count = await db.exercises.count()

    if(count === 0) {
        await db.exercises.bulkAdd(DEFAULT_EXERCISES)
        console.log('✅ Упражнения загружены в базу!')
        console.log(`📊 Добавлено ${DEFAULT_EXERCISES.length} упражнений`)
    }
}