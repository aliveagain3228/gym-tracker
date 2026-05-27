import fs from 'fs';
import path from 'path'

const API_BASE = 'https://exercisedb.dev/api/v1/exercises'

const BODY_PART_MAP = {
    'chest': 'chest', 'back': 'back', 'shoulders': 'shoulders',
    'upper arms': 'biceps', 'lower arms': 'biceps',
    'upper legs': 'legs', 'lower legs': 'legs',
    'waist': 'core', 'cardio': 'fullBody', 'neck': 'fullBody',
}
const TARGET_MUSCLE_MAP = { 'biceps': 'biceps', 'triceps': 'triceps' }
const EQUIPMENT_MAP = {
    'barbell': 'barbell', 'dumbbell': 'dumbbell', 'cable': 'cable',
    'machine': 'machine', 'body weight': 'bodyweight', 'assisted': 'bodyweight',
    'resistance band': 'other', 'bosu ball': 'other', 'band': 'other',
    'kettlebell': 'dumbbell', 'roller': 'other', 'stability ball': 'other',
    'weighted': 'other', 'olympic barbell': 'barbell',
    'ez barbell': 'barbell', 'trap bar': 'barbell',
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms))
}

async function fetchWithRetry(url, retries = 3, delayMs = 2000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const res = await fetch(url)

            if(res.status === 429) {
                const wait = delayMs * attempt
                console.log(`  ⚠️  429 Rate limit. Жду ${wait/1000}с перед попыткой ${attempt}/${retries}...`)
                await sleep(wait)
                continue
            }

            if (!res.ok) {
                console.warn(`  ⚠️  HTTP ${res.status} для ${url}`)
                return []
            }

            const data = await res.json()
            const list = data.exercises ?? data
            return Array.isArray(list) ? list : []
        } catch (err) {
            console.warn(`  ⚠️  Попытка ${attempt} неудачна:`, err.message)
            if (attempt < retries) await sleep(delayMs * attempt)
        }
    }
    return []
}

function convertExercises(ex) {
    const muscleGroup =
        TARGET_MUSCLE_MAP[ex.target] ??
        BODY_PART_MAP[ex.bodyPart] ??
        'fullBody'

    const equipment = EQUIPMENT_MAP[ex.equipment] ?? 'other'

    const description = (ex.instructions ?? [])
        .map((step, i) => `${i + 1}. ${step}`)
        .join('\n')

    return {
        id: `edb_${ex.id}`,
        name: ex.name,
        muscleGroup,
        equipment,
        description,
        tutorialGif: ex.gifUrl,
        previewImage: ex.gifUrl
    }
}

async function main() {
    const bodyParts = [
        'chest', 'back', 'shoulders',
        'upper arms', 'lower arms',
        'upper legs', 'lower legs',
        'waist',
    ]

    const allRaw = []

    for (const bodyPart of bodyParts) {
        const url = `${API_BASE}/bodyPart/${encodeURIComponent(bodyPart)}?limit=50&offset=0`
        console.log(`📥 Загружаю: ${bodyPart}...`)

        const exercises = await fetchWithRetry(url)
        allRaw.push(...exercises)
        console.log(`  ✓ ${exercises.length} упражнений`)

        await sleep(1500)
    }

    const converted = allRaw.map(convertExercises)
    const unique = Array.from(
        new Map(converted.map(ex => [ex.id, ex])).values()
    )

    const outputPath = path.join(process.cwd(), 'public', 'exercises.json')
    fs.writeFileSync(outputPath, JSON.stringify(unique, null, 2), 'utf8')
    console.log(`\n✅ Сохранено ${unique.length} упражнений → public/exercises.json`)
    console.log(`📦 Размер файла: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`)
}

main().catch(err => {
    console.error('❌ Ошибка:', err)
    process.exit(1)
})