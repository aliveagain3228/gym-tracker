import type { Exercise } from "../types";

export async function fetchExercisesFromAPI(): Promise<Exercise[]> {
    console.log('📂 Загружаю упражнения из локального файла...')

    const url = `${import.meta.env.BASE_URL}exercises.json`

    const response = await fetch(url)

    if(!response.ok) {
        throw new Error(
            `exercises.json не найден (${response.status}). ` +
            `Запусти: node scripts/fetchExercises.mjs`
        )
    }
    const exercises: Exercise[] = await response.json()
    console.log(`✅ Загружено ${exercises.length} упражнений из файла`)
    return exercises
}