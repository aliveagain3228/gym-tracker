import type { Exercise } from "../types";

export async function fetchExercisesFromAPI(): Promise<Exercise[]> {
    console.log('\'🌐 Скачиваю готовую базу упражнений из интернета...')

try {
    const response = await fetch(
        'https://raw.githubusercontent.com/aliveagain3228/exercisesAPI/refs/heads/main/exercises.json'
    )
    if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`)
    }


    const exercises: Exercise[] = await response.json()

    console.log(`✅ Успешно загружено ${exercises.length} упражнений из cвоей базы!`)
    return exercises
} catch (error) {
    console.error('❌ Не удалось скачать API:', error)
    return []
}
}





