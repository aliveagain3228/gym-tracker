import { motion, AnimatePresence } from "framer-motion";
import { X, Dumbbell } from 'lucide-react';
import type { Exercise } from "../../types";
import { MUSCLE_GROUP_CONFIG, EQUIPMENT_CONFIG } from "../../types";
import MuscleIcon from "../MuscleIcon/MuscleIcon.tsx";
import MuscleBodySvg from "../MuscleBodySvg/MuscleBodySvg.tsx";

interface ExerciseTutorialModalProps {
    exercise: Exercise | null
    isOpen: boolean
    onClose: () => void
    onAdd?: (exercise: string, exerciseName: string) => void
}

export default function ExerciseTutorialModal({ exercise, isOpen, onClose, onAdd }: ExerciseTutorialModalProps) {
    if (!exercise) return null

    const steps = exercise.description
    ? exercise.description
            .split('\n')
            .filter(line => line.trim())
        : []

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-x-4 top-[5%] max-w-md mx-auto bg-slate-900 rounded-3xl overflow-hidden z-50 shadow-2xl flex flex-col"
                    >

                        <div className="relative bg-slate-800 flex items-center justify-center py-8">
                            <MuscleBodySvg muscleGroup={exercise.muscleGroup} className="w-28 h-28" />
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
                            >
                                <X size={18} className="text-white" />
                            </button>
                        </div>

                        <div className="p-5 overflow-y-auto max-h-[50vh]">
                            <h2 className="text-xl font-bold text-white mb-2">
                                {exercise.name}
                            </h2>

                            <div className="flex gap-2 flex-wrap mb-4">
                                <span className="flex items-center gap-1.5 text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-full">
                                    <MuscleIcon
                                        name={MUSCLE_GROUP_CONFIG[exercise.muscleGroup].icon}
                                        size={12}
                                    />
                                    {MUSCLE_GROUP_CONFIG[exercise.muscleGroup].label}
                                </span>
                                <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-400 px-3 py-1.5 rounded-full">
                                    <Dumbbell size={12} />
                                    {EQUIPMENT_CONFIG[exercise.equipment].label}
                                </span>
                            </div>

                            {steps.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                                        Техника выполнения
                                    </h3>
                                    <div className="flex flex-col gap-2">
                                        {steps.map((step, index) => (
                                            <div
                                                key={index}
                                                className="flex gap-3"
                                            >
                                                <div className="w-6 h-6 rounded-full bg-indigo-600/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-indigo-400 text-xs font-bold">
                                                        {index + 1}
                                                    </span>
                                                </div>
                                                <p className="text-slate-400 text-sm leading-relaxed">
                                                    {step.replace(/^\d+\.\s*/, '')}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {onAdd && (
                            <div className="p-4 border-t border-slate-800 flex-shrink-0">
                                <button
                                    onClick={() => {
                                        onAdd(exercise.id, exercise.name)
                                        onClose()
                                    }}
                                    className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
                                >
                                    + Добавить тренировку
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}