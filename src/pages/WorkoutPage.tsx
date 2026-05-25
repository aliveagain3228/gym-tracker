import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {AnimatePresence, motion } from "framer-motion";
import { useWorkouts } from "../hooks/useWorkouts.ts";
import ExercisePicker from "../components/ExercisePicker/ExercisePicker.tsx";
import SetRow from "../components/SetRow/SetRow.tsx";
import { useTemplates } from "../hooks/useTemplates.ts";

export default function WorkoutPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { workouts, addExercise, addSet, toggleSet, updateSet, completeWorkout } = useWorkouts()
    const [showPicker, setShowPicker] = useState(false)

    const { saveAsTemplate } = useTemplates()
    const [saved, setSaved] = useState(false)

    const [elapsed, setElapsed] = useState(0)
    const intervalRef = useRef<number | null>(null)

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setElapsed(prev => prev + 1)
        }, 1000)

        return () => {
            if(intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [])

    const workout = workouts.find(w => w.id === id)

    if(!workout) {
        return (
            <div className="flex items-center justify-center min-h-screen text-slate-400">
                Тренировка не найдена
            </div>
        )
    }

    const formatTime = (seconds: number) : string => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0')
        const s = (seconds % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    const handleComplete = async () => {
        const minutes = Math.floor(elapsed / 60)
        await completeWorkout(workout.id, minutes)
        navigate('/')
    }

    const handleAddExercise = async (exerciseId: string, exerciseName: string) => {
        await addExercise(workout.id, exerciseId, exerciseName)
        setShowPicker(false)
    }

    const handleAddSet = async (exerciseId: string) => {
        const exercise = workout.exercises.find(e => e.id === exerciseId)
        const lastSet = exercise?.sets[exercise.sets.length - 1]

        await addSet (
            workout.id,
            exerciseId,
            lastSet?.weight ?? 20,
            lastSet?.reps ?? 10
        )
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-6 pb-32">

            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 rounded-xl bg-slate-500 hover:bg-slate-700 transition-colors text-slate-400"
                >
                    ←
                </button>
                <div className="flex-1 min-w-0">
                    <h1 className="font-bold text-white text-lg truncate">{workout.name}</h1>
                    <p className="text-slate-400 text-sm">{formatTime(elapsed)}</p>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {workout.exercises.map(exercise => (
                    <div key={exercise.id} className="bg-slate-900 rounded-2xl p-4">

                        <h2 className="font-semibold text-white mb-3">{exercise.exerciseName}</h2>

                        <div className="flex flex-col gap-2 mb-3">
                            <AnimatePresence>
                                {exercise.sets.map((set, index) => (
                                    <SetRow
                                        key={set.id}
                                        set={set}
                                        index={index + 1}
                                        onToggle={() => toggleSet(workout.id, exercise.id, set.id)}
                                        onUpdate={(weight, reps) => updateSet(workout.id, exercise.id, set.id, weight, reps)}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>

                        <button
                            onClick={() => handleAddSet(exercise.id)}
                            className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-indigo-500 text-slate-500 hover:text-indigo-400 text-sm transition-colors"
                        >
                            + Добавить подход
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={() => setShowPicker(true)}
                className="w-full py-4 mt-4 rounded-2xl border-2 border-dashed border-slate-700 hover:border-indigo-500 hover:bg-indigo-500/5 transition-all text-slate-400 hover:text-indigo-400 font-medium text-sm"
            >
                + Добавить упражнение
            </button>

            {workout.exercises.length > 0 && !workout.completed && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/90 backdrop-blur-sm">
                    <div className="max-w-2xl mx-auto flex gap-3">

                        <button
                            onClick={async () => {
                                await saveAsTemplate(workout)
                                setSaved(true)
                                setTimeout(() => setSaved(false), 2000)
                            }}
                            className="px-4 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 transition-colors text-slate-300 text-sm flex-shrink-0"
                        >
                            {saved ? '✓ Сохранено' : '📋 Шаблон'}
                        </button>

                        <button
                            onClick={handleComplete}
                            className="flex-1 w-full py-4 rounded-2xl bg-green-600 hover:bg-green-500 active:scale-98 transition-all text-white font-bold text-base"
                        >
                            ✓ Завершить тренировку
                        </button>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {showPicker && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowPicker(false)}
                        className="fixed inset-0 z-30 flex items-end bg-black/50 backdrop-blur-sm"
                    >
                        <ExercisePicker
                            onSelect={handleAddExercise}
                            onClose={() => setShowPicker(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}