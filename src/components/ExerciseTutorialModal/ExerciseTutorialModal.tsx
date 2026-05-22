import { motion, AnimatePresence } from "framer-motion";
import { X, Play } from 'lucide-react';
import type { Exercise } from "../../types";

interface ExerciseTutorialModalProps {
    exercise: Exercise | null
    isOpen: boolean
    onClose: () => void
}

export default function ExerciseTutorialModal({ exercise, isOpen, onClose }: ExerciseTutorialModalProps) {
    if (!exercise) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-slate-900 rounded-3xl overflow-hidden z-50 shadow-2xl"
                    >

                        <div className="relative bg-slate-800 aspect-square">
                            {exercise.tutorialGif ? (
                                <img
                                    src={exercise.tutorialGif}
                                    alt={`${exercise.name} техника`}
                                    className="w-full h-full object-cover"
                                />
                            ) : exercise.previewImage ? (
                                <img
                                    src={exercise.previewImage}
                                    alt={exercise.name}
                                    className="w-full h-full object-cover"

                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Play size={64} className="text-indigo-600" />
                                </div>
                            )}

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-sm hover:bg-slate-900 transition-colors flex items-center justify-center"
                            >
                                <X size={20} className="text-white" />
                            </button>
                        </div>


                        <div className="p-6">
                            <h2 className="text-xl font-bold text-white mb-2">
                                {exercise.name}
                            </h2>

                            {exercise.description && (
                                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                                    {exercise.description}
                                </p>
                            )}

                            <div className="flex gap-2">
                                <span className="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-full">
                                    {exercise.muscleGroup}
                                </span>
                                <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1.5 rounded-full">
                                    {exercise.equipment}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}