import { db } from "./index.ts";
import type { Exercise } from "../types";

const DEFAULT_EXERCISES: Exercise[] = [

    { id: 'bench-press',         name: 'Жим штанги лёжа',               muscleGroup: 'chest',     equipment: 'barbell'    },
    { id: 'incline-db-press',    name: 'Жим гантелей на наклонной',      muscleGroup: 'chest',     equipment: 'dumbbell'   },
    { id: 'pullover',            name: 'Пуловер с гантелью',             muscleGroup: 'chest',     equipment: 'dumbbell'   },
    { id: 'ohp',                 name: 'Жим штанги с груди стоя',        muscleGroup: 'shoulders', equipment: 'barbell'    },
    { id: 'lateral-raise',       name: 'Махи гантелями в стороны',       muscleGroup: 'shoulders', equipment: 'dumbbell'   },
    { id: 'hanging-leg-raise',   name: 'Подъём ног в висе',              muscleGroup: 'core',      equipment: 'bodyweight' },
    { id: 'crunch',              name: 'Скручивания на пресс',           muscleGroup: 'core',      equipment: 'bodyweight' },

    { id: 'barbell-row',         name: 'Тяга штанги в наклоне',         muscleGroup: 'back',      equipment: 'barbell'    },
    { id: 'db-row',              name: 'Тяга гантели к поясу',          muscleGroup: 'back',      equipment: 'dumbbell'   },
    { id: 'barbell-curl',        name: 'Подъём штанги на бицепс',       muscleGroup: 'biceps',    equipment: 'barbell'    },
    { id: 'french-press',        name: 'Французский жим',               muscleGroup: 'triceps',   equipment: 'barbell'    },
    { id: 'reverse-curl',        name: 'Подъём штанги обратным хватом', muscleGroup: 'biceps',    equipment: 'barbell'    },
    { id: 'cable-pushdown',      name: 'Разгибание рук в станке стоя',  muscleGroup: 'triceps',   equipment: 'cable'      },
    { id: 'plank',               name: 'Планка',                        muscleGroup: 'core',      equipment: 'bodyweight' },

    { id: 'squat',               name: 'Приседания со штангой',         muscleGroup: 'legs',      equipment: 'barbell'    },
    { id: 'leg-curl',            name: 'Сгибание ног в станке',         muscleGroup: 'legs',      equipment: 'machine'    },
    { id: 'leg-extension',       name: 'Разгибание ног в станке',       muscleGroup: 'legs',      equipment: 'machine'    },
    { id: 'deadlift',            name: 'Становая тяга',                 muscleGroup: 'legs',      equipment: 'barbell'    },
    { id: 'wrist-curl',          name: 'Сгибание кистей со штангой',    muscleGroup: 'core',      equipment: 'barbell'    },
    { id: 'reverse-wrist-curl',  name: 'Разгибание кистей с гантелями', muscleGroup: 'core',      equipment: 'dumbbell'   },
    { id: 'situp',               name: 'Подъём корпуса лёжа',          muscleGroup: 'core',      equipment: 'bodyweight' },
    { id: 'side-crunch',         name: 'Боковые скручивания',           muscleGroup: 'core',      equipment: 'bodyweight' },
]

export async function seedExerciseIfEmpty() {
    const count = await db.exercises.count()

    if(count === 0) {
        await db.exercises.bulkAdd(DEFAULT_EXERCISES)
        console.log('Exercises seeded!')
    }
}