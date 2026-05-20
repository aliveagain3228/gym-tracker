import type { Workout } from '../../types'
import { calculateVolume } from '../../utils/calculations'

interface WorkoutCardProps {
    workout: Workout
    onOpen: () => void
    onDelete: () => void
}

export default function WorkoutCard({ workout, onOpen, onDelete }: WorkoutCardProps) {

    const allSets = workout.exercises.flatMap(e => e.sets)
    const totalVolume = calculateVolume(allSets)
    const completedSets = allSets.filter(s => s.completed).length
    const totalSets = allSets.length
    const displayDate = new Date(workout.date + 'T00:00:00')
        .toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })

    return (
        <div
            onClick={onOpen}
            className="bg-slate-900 rounded-2xl p-4 cursor-pointer hover:bg-slate-800 transition-colors group"
        >
            <div className="flex items-start justify-between">

                <div className="flex-1 min-w-0">

                    <div className="flex items-center gap-2 mb-1">
                        {workout.completed && (
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                                ✓ Завершена
                            </span>
                        )}
                        <span className="text-xs text-slate-500">{displayDate}</span>
                    </div>

                    <h3 className="font-semibold text-white truncate">{workout.name}</h3>

                    {workout.exercises.length > 0 && (
                        <p className="text-slate-500 text-xs mt-1 truncate">
                            {workout.exercises.map(e => e.exerciseName).join(' · ')}
                        </p>
                    )}
                </div>

                <button
                    onClick={e => { e.stopPropagation(); onDelete() }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-red-400 p-1 ml-2 flex-shrink-0"
                >
                    ✕
                </button>
            </div>

            {totalSets > 0 && (
                <div className="flex gap-4 mt-3 pt-3 border-t border-slate-800">
                    <div>
                        <span className="text-xs text-slate-500">Подходов</span>
                        <p className="text-sm font-medium text-white">{completedSets}/{totalSets}</p>
                    </div>
                    <div>
                        <span className="text-xs text-slate-500">Тоннаж</span>
                        <p className="text-sm font-medium text-white">
                            {totalVolume > 0 ? `${totalVolume} кг` : '—'}
                        </p>
                    </div>
                    {workout.duration && (
                        <div>
                            <span className="text-xs text-slate-500">Время</span>
                            <p className="text-sm font-medium text-white">{workout.duration} мин</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}