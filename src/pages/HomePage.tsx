import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion";
import { useWorkouts } from "../hooks/useWorkouts.ts";
import WorkoutCard from "../components/WorkoutCard/WorkoutCard.tsx";
import { useTemplates } from "../hooks/useTemplates.ts";
import {
    Plus, History, Dumbbell,
    Trash2, Play, X
} from 'lucide-react'

export default function HomePage() {
    const navigate = useNavigate()
    const { workouts, loading, createWorkout, deleteWorkout, addExercise, addSet } = useWorkouts()
    const [isCreating, setIsCreating] = useState(false)
    const [newName, setNewName] = useState('')

    const { templates, createFromTemplate, deleteTemplate } = useTemplates()

    const handleCreate = async () => {
        if (!newName.trim()) return
        const workout = await createWorkout(newName.trim())
        setNewName('')
        setIsCreating(false)
        navigate(`/workout/${workout.id}`)
    }

    if(loading) {
        return (
            <div className="flex items-center justify-center min-h-screen gap-3">
                <Dumbbell className="text-indigo-500 animate-pulse" size={32} />
                <div className="text-slate-400 text-sm">Загрузка...</div>
            </div>
        )
    }

    const today = new Date().toISOString().split('T')[0]
    const todayWorkouts = workouts.filter(w => w.date === today)
    const pastWorkouts = workouts.filter(w => w.date !== today)

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Gym Tracker</h1>
                    <p className="text-slate-400 text-sm mt-0.5">
                        {new Date().toLocaleDateString("ru-RU", {
                            weekday: 'long', day: 'numeric', month: 'long'
                        })}
                    </p>
                </div>


            <button
                onClick={() => navigate('/history')}
                className="w-11 h-11 rounded-2xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
            >
                <History size={18} className="text-slate-300" />
            </button>
            </div>

            <motion.button
                onClick={() => setIsCreating(true)}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 font-semibold text-white mb-6 shadow-lg shadow-indigo-500/20"
            >
                <Plus size={20} /> Начать тренировку
            </motion.button>

            {templates.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
                        Мои шаблоны
                    </h2>
                    <div className="flex flex-col gap-2">
                        {templates.map(template => (
                            <div
                                key={template.id}
                                className="bg-slate-900 rounded-2xl p-4 flex items-center justify-between group"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-white text-sm">{template.name}</p>
                                    <p className="text-slate-500 text-xs mt-0.5 truncate">
                                        {template.exercises.map(e => e.exerciseName).join(' · ')}
                                    </p>
                                </div>

                                <div className="flex gap-2 ml-3 flex-shrink-0">
                                    <button
                                        onClick={async () => {
                                            const workout = await createFromTemplate(
                                                template,
                                                createWorkout,
                                                addSet,
                                                addExercise
                                            )
                                            navigate(`/workout/${workout.id}`)
                                        }}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <Play size={12} /> Старт
                                    </button>

                                    <button
                                        onClick={() => deleteTemplate(template.id)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-red-400 p-1.5"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 overflow-hidden"
                    >
                        <div className="bg-slate-900 rounded-2xl p-4 flex gap-3 border border-slate-800">
                            <input
                                type="text"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleCreate()}
                                placeholder="Название: Грудь и плечи..."
                                autoFocus
                                className="flex-1 bg-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                onClick={handleCreate}
                                className="bg-indigo-600 hover:bg-slate-500 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
                            >
                                Создать
                            </button>
                            <button
                                onClick={() => { setIsCreating(false); setNewName('') }}
                                className="bg-slate-800 hover:bg-slate-700 rounded-xl px-3 py-2.5 text-sm transition-colors text-slate-400"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {todayWorkouts.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
                        Сегодня
                    </h2>

                    <div className="flex flex-col gap-3">
                        {todayWorkouts.map((workout, index) => (
                            <motion.div
                                key={workout.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <WorkoutCard
                                workout={workout}
                                onOpen={() => navigate(`/workout/${workout.id}`)}
                                onDelete={() => deleteWorkout(workout.id)}
                                />
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {pastWorkouts.length > 0 && (
                <section>
                    <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
                        Прошлые тренировки
                    </h2>
                    <div className="flex flex-col gap-3">
                        {pastWorkouts.map((workout, index) => (
                            <motion.div
                            key={workout.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            >
                                <WorkoutCard
                                workout={workout}
                                onOpen={() => navigate(`/workout/${workout.id}`)}
                                onDelete={() => deleteWorkout(workout.id)}
                                />
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {workouts.length === 0 && !isCreating && (
                <div className="text-center py-16 text-slate-500">
                    <div className="text-4xl mb-3">🏋️</div>
                    <p className="font-medium">Нет тренировок</p>
                    <p className="text-sm mt-1">Нажми кнопку выше чтобы начать</p>
                </div>
            )}
        </div>

    )
}