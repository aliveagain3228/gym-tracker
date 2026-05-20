import { useState   } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useExercises } from "../../hooks/useExercises.ts";
import type { MuscleGroup } from "../../types";
import { MUSCLE_GROUP_CONFIG } from "../../types";

interface ExercisesPickerProps {
    onSelect: (exerciseId: string, exerciseName: string) => void
    onClose: () => void
}

export default function ExercisePicker({ onSelect, onClose }: ExercisesPickerProps) {

    const { exercises, searchExercises } = useExercises()
    const [query, setQuery] = useState('')
    const [activeGroup, setActiveGroup] = useState<MuscleGroup | null>(null)

    const filtered = searchExercises(query).filter(e =>
    activeGroup ? e.muscleGroup === activeGroup : true
    )

    const muscleGroups = Object.keys(MUSCLE_GROUP_CONFIG) as MuscleGroup[]

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="bg-slate-900 rounded-t-3xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        >
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
                className="bg-slate-900 rounded-t-3xl w-full max-w-2xl max-h-[80vh] flex flex-col"
            >
            <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-slate-700 rounded-full" />
            </div>

            <div className="px-4 pb-4">
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Поиск упражнения..."
                    autoFocus
                    className="w-full bg-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
                />

                <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                    <button
                        onClick={() => setActiveGroup(null)}
                        className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full transition-colors ${
                            activeGroup === null
                            ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                    >
                        Все
                    </button>
                    {muscleGroups.map(group => (
                        <button
                            key={group}
                            onClick={() => setActiveGroup(prev => prev === group ? null : group)}
                            className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                                activeGroup === group
                                ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                        >
                            {MUSCLE_GROUP_CONFIG[group].emoji} {MUSCLE_GROUP_CONFIG[group].label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-y-auto px-4 pb-8 flex flex-col gap-2">
                {filtered.length === 0 ? (
                    <p className="text-center text-slate-500 text-sm py-8">Ничего не найдено</p>
                ) : (
                    filtered.map(exercise => (
                        <button
                             key={exercise.id}
                             onClick={() => onSelect(exercise.id, exercise.name)}
                             className="flex items-center gap-3 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors text-left"
                        >
                            <span className="text-xl">
                                {MUSCLE_GROUP_CONFIG[exercise.muscleGroup].emoji}
                            </span>
                            <div>
                                <p className="text-sm font-medium text-white">{exercise.name}</p>
                                <p className="text-xs text-slate-500">
                                    {MUSCLE_GROUP_CONFIG[exercise.muscleGroup].label}
                                </p>
                            </div>
                        </button>
                    ))
                )}
            </div>
            </motion.div>
        </motion.div>
    )
}