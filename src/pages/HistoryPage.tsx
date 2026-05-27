import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    LineChart, Line, XAxis, YAxis,
    Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { useWorkouts } from "../hooks/useWorkouts.ts";
import { useExercises } from "../hooks/useExercises.ts";
import {calculate1RM, calculateVolume, getBestSet} from "../utils/calculations.ts";
import { ArrowLeft, Dumbbell, RotateCcw, Scale, BarChart3 } from "lucide-react";

export default function HistoryPage() {
    const navigate = useNavigate()
    const { workouts } = useWorkouts()
    const { exercises } = useExercises()

    const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null)
    const completedWorkouts = workouts
        .filter(w => w.completed)
        .sort((a, b ) => a.date.localeCompare(b.date))

    const totalVolume = completedWorkouts.reduce((sum, w ) => {
        const sets = w.exercises.flatMap(e => e.sets)
        return sum + calculateVolume(sets)
    }, 0)

    const totalSets = completedWorkouts.reduce((sum, w) =>
        sum + w.exercises.flatMap(e => e.sets).filter(s => s.completed).length
   , 0 )

    const exercisesInHistory = exercises.filter(ex =>
    completedWorkouts.some(w =>
    w.exercises.some(e => e.exerciseId === ex.id)
    )
    )

    const chartData = selectedExerciseId
    ? completedWorkouts
            .filter(w => w.exercises.some(e => e.exerciseId === selectedExerciseId))
                .map(w => {
                    const exercise = w.exercises.find(e => e.exerciseId === selectedExerciseId) !
                    const best = getBestSet(exercise.sets)

                    return {
                        date: new Date(w.date + 'T00:00:00')
                            .toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
                        volume: calculateVolume(exercise.sets),
                        bestWeight: best?.weight ?? 0,
                        estimated1RM: best ? calculate1RM(best.weight, best.reps) : 0,
                    }
                })
                : []

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">

            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors text-slate-400"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold text-white">История тренировок</h1>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                    { label: 'Тренировок', value: completedWorkouts.length, icon: Dumbbell, color: 'text-indigo-400'},
                    { label: 'Подходов', value: totalSets, icon: RotateCcw, color: 'text-green-400'},
                    { label: 'Тоннаж (кг)', value: totalVolume.toLocaleString('ru-RU'), icon: Scale, color: 'text-purple-400'},
                ].map(stat => {
                    const IconComponent = stat.icon
                    return (
                        <div
                            key={stat.label}
                            className="bg-slate-900 rounded-2xl p-4 text-center"
                        >
                            <IconComponent size={28} className={`mx-auto mb-2 ${stat.color}`}/>
                            <p className="text-white font-bold text-xl">{stat.value}</p>
                            <p className="text-slate-500 text-xs mt-0.5">{stat.label}</p>
                        </div>
                    )
                })}
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <BarChart3 size={18} className="text-indigo-400" />
                    <h2 className="font-semibold text-white mb-3">Прогрессия</h2>
                </div>


                <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                    {exercisesInHistory.length === 0 ? (
                        <p className="text-slate-500 text-sm">
                            Завершите тренировки чтобы увидеть прогресс
                        </p>
                    ) : (
                        exercisesInHistory.map(ex => (
                            <button
                                key={ex.id}
                                onClick={() => setSelectedExerciseId(
                                    prev => prev === ex.id ? null : ex.id
                                )}
                                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                                    selectedExerciseId === ex.id
                                    ? 'bg-indigo-600 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                            >
                                {ex.name}
                            </button>
                        ))
                    )}
                </div>

                {selectedExerciseId && chartData.length >= 2 ? (
                    <div>
                        <ResponsiveContainer width="100%" height={180}>
                            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 10, fill: '#64748b' }}
                                    axisLine={false}
                                    tickLine={false}
                                    />
                                <YAxis
                                    tick={{ fontSize: 10, fill: '#64748b' }}
                                    axisLine={false}
                                    tickLine={false}
                                    />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if(!active || !payload?.length) return null
                                        const d = payload[0].payload
                                        return (
                                            <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs">
                                                <p className="text-slate-400 mb-1">{d.date}</p>
                                                <p className="text-white">Вес: <span className="text-indigo-400 font-bold">{d.bestWeight} кг</span></p>
                                                <p className="text-white">~1RM: <span className="text-purple-400 font-bold">{d.estimated1RM} кг</span></p>
                                                <p className="text-white">Тоннаж: <span className="text-green-400 font-bold">{d.volume} кг</span></p>
                                            </div>
                                        )
                                    }}
                                    />
                                <Line
                                    type="monotone"
                                    dataKey="bestWeight"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    dot={{ fill: '#6366f1', r: 3, strokeWidth: 0 }}
                                    activeDot={{ r:5 }}
                                    name="Рабочий вес"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="estimated1RM"
                                    stroke="#a855f7"
                                    strokeWidth={2}
                                    strokeDasharray="4 4"
                                    dot={false}
                                    name="Расч. 1RM"
                                    />
                            </LineChart>
                        </ResponsiveContainer>

                        <div className="flex gap-4 mt-2 justify-center">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-0.5 bg-slate-500" />
                                <span className="text-xs text-slate-500">Рабочий вес</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-0.5 bg-purple-500 border-dashed" />
                                <span className="text-xs text-slate-500">Расч. 1RM</span>
                            </div>
                        </div>
                    </div>
                ) : selectedExerciseId ? (
                    <p className="text-center text-slate-500 text-sm py-8">
                        Нужно минимум 2 тренировки с этим упражнением
                    </p>
                ) : null}
            </div>

            <h2 className="font-semibold text-white mb-3">Все тренировки</h2>
            <div className="flex flex-col gap-3">
                {completedWorkouts.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <BarChart3 size={48} className="mx-auto mb-3 text-slate-600" />
                        <p className="text-sm">Завершите первую тренировку чтобы увидеть историюю</p>
                    </div>
                ) : (
                    [...completedWorkouts].reverse().map((workout, index) => (
                        <motion.div
                            key={workout.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                            className="bg-slate-900 rounded-2xl p-4"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="font-medium text-white">{workout.name}</p>
                                    <p className="text-slate-500 text-xs mt-0.5">
                                        {new Date(workout.date + 'T00:00:00')
                                            .toLocaleDateString('ru-RU', {
                                                weekday: 'long', day: 'numeric', month: 'long'
                                            })}
                                    </p>
                                </div>
                                {workout.duration && (
                                    <span className="text-xs text-slate-500 bg-slate-800  px-2 py-1 rounded-lg">
                                        {workout.duration} мин
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-1 mt-2">
                                {workout.exercises.map(ex => {
                                    const best = getBestSet(ex.sets)
                                    return (
                                        <div
                                            key={ex.id}
                                            className="flex items-center justify-between"
                                        >
                                            <span className="text-slate-400 text-xs">{ex.exerciseName}</span>
                                            {best && (
                                                <span className="text-xs text-slate-500">
                                                    {best.weight} кг × {best.reps}
                                                    <span className="text-indigo-400 ml-1">
                                                        ~{calculate1RM(best.weight, best.reps)} кг 1RM
                                                    </span>
                                                </span>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    )
}