import { useState } from "react";
import { motion } from 'framer-motion'
import type { Set } from "../../types"
import { calculate1RM } from "../../utils/calculations.ts";

interface  SetRowProps{
    set: Set
    index: number
    onToggle: () => void
    onUpdate: (weight: number, reps: number) => void
}

export default function SetRow({ set, index, onToggle, onUpdate }: SetRowProps) {
    const [weight, setWeight] = useState(set.weight)
    const [reps, setReps] = useState(set.reps)
    const estimated1RM = weight > 0 && reps > 0 ? calculate1RM(weight, reps) : null

    const handleWeightChange = (delta: number) => {
        const newWeight = Math.max(0, Math.round((weight + delta) * 10) / 10)
        setWeight(newWeight)
        onUpdate(newWeight, reps)
    }

    const handleRepsChange = (delta: number) => {
        const newReps = Math.max(1, reps + delta)
        setReps(newReps)
        onUpdate(weight, newReps)
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`rounded-xl p-3 transition-colors ${
                set.completed
                ? "bg-green-500/10 border border-green-500/20"
                : 'bg-slate-800'
            }`}
        >
            <div className="flex items-center gap-3">

                <span className="text-slate-500 text-sm font-medium w-6 text-center flex-shrink-0">
                    {index}
                </span>

                <div className="flex-1">
                    <p className="text-xs text-slate-500 mb-1 text-center">Вес (кг)</p>
                    <div className="flex items-center gap-2 justify-center">
                        <button
                            onClick={() => handleWeightChange(-2.5)}
                            className="w-9 h-9 rounded-lg bg-slate-700 hover:bg-slate-600 active:scale-95 transition-all text-white font-bold text-sm flex items-center justify-center"
                        >
                            −
                        </button>
                        <input
                            type="number"
                            value={weight}
                            onChange={e => {
                                const val = parseFloat(e.target.value) || 0
                                setWeight(val)
                                onUpdate(val, reps)
                            }}
                            className="w-16 text-center bg-slate-700 rounded-lg py-2 text-white font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            onClick={() => handleWeightChange(2.5)}
                            className="w-9 h-9 rounded-lg bg-slate-700 hover:bg-slate-600 active:scale-95 transition-all text-white font-bold text-sm flex items-center justify-center"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="text-slate-600 font-bold">×</div>

                <div className="flex-1">
                    <p className="text-xs text-slate-500 mb-1 text-center">Повторений</p>
                    <div className="flex items-center gap-2 justify-center">
                        <button
                            onClick={() => handleRepsChange(-1)}
                            className="w-9 h-9 rounded-lg bg-slate-700 hover:bg-slate-600 active:scale-95 transition-all text-white font-bold text-sm flex items-center justify-center"
                        >
                            −
                        </button>
                        <input
                            type="number"
                            value={reps}
                            onChange={e => {
                                const val = parseInt(e.target.value) || 1
                                setReps(val)
                                onUpdate(weight,val)
                            }}
                            className="w-16 text-center bg-slate-700 rounded-lg py-2 text-white font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                        onClick={() => handleRepsChange(1)}
                        className="w-9 h-9 rounded-lg bg-slate-700 hover:bg-slate-600 active:scale-95 transition-all text-white font-bold text-sm flex items-center justify-center"
                        >
                            +
                        </button>
                    </div>
                </div>

                <button
                    onClick={onToggle}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all active:scale-95 ${
                        set.completed
                        ? 'bg-green-500 text-white'
                            : 'bg-slate-700 text-slate-500 hover:bg-slate-600'
                    }`}
                >
                    ✓
                </button>
            </div>

            {estimated1RM && set.completed && (
                <p className="text-xs text-slate-500 mt-2 text-center">
                    ~1RM: <span className="text-indigo-400 font-medium">{estimated1RM} кг</span>
                </p>
            )}
        </motion.div>
    )
}