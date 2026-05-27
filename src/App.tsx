import { Routes, Route, Navigate, HashRouter, useLocation } from 'react-router-dom'
import WorkoutPage from './pages/WorkoutPage'
import HistoryPage from './pages/HistoryPage'
import HomePage from './pages/HomePage'
import { AnimatePresence, motion } from "framer-motion";

const pageVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
}

const pageTransition = {
    duration: 0.22,
    ease: 'easeOut'
}

function AnimatedRoutes() {
    const location = useLocation()

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
                className="min-h-screen"
            >
                <Routes location={location}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/workout/:id" element={<WorkoutPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </motion.div>
        </AnimatePresence>
    )
}

export default function App() {
    return (
        <HashRouter>
            <div className="min-h-screen bg-slate-950 text-white">
                <AnimatedRoutes />
            </div>
        </HashRouter>
    )
}
