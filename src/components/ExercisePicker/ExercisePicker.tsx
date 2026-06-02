import { useState   } from "react";
import { motion } from "framer-motion";
import { Search, Info} from 'lucide-react'
import { useExercises } from "../../hooks/useExercises.ts";
import type { MuscleGroup, Exercise } from "../../types";
import { MUSCLE_GROUP_CONFIG } from "../../types";
import MuscleIcon from "../MuscleIcon/MuscleIcon.tsx";
import ExerciseTutorialModal from "../ExerciseTutorialModal/ExerciseTutorialModal.tsx";
import MuscleBodySvg from "../MuscleBodySvg/MuscleBodySvg.tsx";

interface ExercisesPickerProps {
    onSelect: (exerciseId: string, exerciseName: string) => void
    onClose: () => void
}

const PREVIEW_BG: Record<MuscleGroup, string> = {
    chest:    'from-red-500/30 to-red-900/20',
    back:     'from-blue-500/30 to-blue-900/20',
    shoulders:'from-orange-500/30 to-orange-900/20',
    biceps:   'from-purple-500/30 to-purple-900/20',
    triceps:  'from-violet-500/30 to-violet-900/20',
    legs:     'from-green-500/30 to-green-900/20',
    core:     'from-yellow-500/30 to-yellow-900/20',
    fullBody: 'from-indigo-500/30 to-indigo-900/20',
}

export default function ExercisePicker({ onSelect }: ExercisesPickerProps) {

    const { searchExercises } = useExercises()
    const [query, setQuery] = useState('')
    const [activeGroup, setActiveGroup] = useState<MuscleGroup | null>(null)
    const [tutorialExercise, setTutorialExercise] = useState<Exercise | null>(null)

    const filtered = searchExercises(query).filter(e =>
    activeGroup ? e.muscleGroup === activeGroup : true
    )

    const muscleGroups = Object.keys(MUSCLE_GROUP_CONFIG) as MuscleGroup[]

    return (
        <>
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
                <div className="relative mb-3">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"/>
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Поиск упражнения..."
                        autoFocus
                        className="w-full bg-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>


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
                            className={`flex items-center gap-1.5 flex-shrink-0 text-xs px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                                activeGroup === group
                                ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                        >
                            <MuscleIcon
                                name={MUSCLE_GROUP_CONFIG[group].icon}
                                size={14}
                            />
                            {MUSCLE_GROUP_CONFIG[group].label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-y-auto px-4 pb-8 flex flex-col gap-2">
                {filtered.length === 0 ? (
                    <p className="text-center text-slate-500 text-sm py-8">Ничего не найдено</p>
                ) : (
                    filtered.map(exercise => (
                        <div
                            key={exercise.id}
                            className="flex items-center gap-3 p-2 rounded-xl bg-slate-800 hover:bg-slate-750 transition-colors"
                        >
                            <div
                                className={`w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center
                                bg-gradient-to-br ${PREVIEW_BG[exercise.muscleGroup]}
                                border border-white/5
                                `}
                            >
                                <MuscleBodySvg
                                    muscleGroup={exercise.muscleGroup}
                                    className="h-10 w-auto"
                                    />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white leading-tight">
                                    {exercise.name}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {MUSCLE_GROUP_CONFIG[exercise.muscleGroup].label}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                                {exercise.description && (
                                    <button
                                        onClick={() => setTutorialExercise(exercise)}
                                        className="w-9 h-9 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
                                        title="Техника выполнения"
                                    >
                                        <Info size={16} className="text-slate-400 hover:text-white" />
                                    </button>
                                )}

                                <button
                                    onClick={() => onSelect(exercise.id, exercise.name)}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-2 rounded-lg transition-colors font-medium"
                                >
                                    + Добавить
                                </button>
                            </div>
                        </div>
                        ))
                    )}
            </div>
            </motion.div>

            <ExerciseTutorialModal
                exercise={tutorialExercise}
                isOpen={tutorialExercise !== null}
                onClose={() => setTutorialExercise(null)}
                />
        </>
    )
}