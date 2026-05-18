
export function calculate1RM(weight: number, reps: number): number {
    if (reps === 1) return weight

    const epley = weight * (1 + reps / 30)

    const brzycki = reps <= 10
    ? weight * (36 / (37 - reps))
        : epley

    return Math.round((epley + brzycki) / 2)
}

export function calculateVolume(sets: { weight: number; reps: number; completed: boolean }[]): number {
    return sets
        .filter(s => s.completed)
        .reduce((total, s) => total + s.weight * s.reps, 0)
}

export function getBestSet(sets: { weight: number; reps: number; completed: boolean }[]): { weight: number; reps: number} | null {
    const completed = sets.filter(s => s.completed)
    if (completed.length === 0) return null;

    return completed.reduce((best, current) => {
        const bestScore = calculate1RM(best.weight, best.reps)
        const currentScore = calculate1RM(current.weight, current.reps)
        return currentScore > bestScore ? current : best
    })
}

export function formatWeight(weight: number): string {
    return weight % 1 === 0 ? `${weight}` : `${weight.toFixed(1)}`
}