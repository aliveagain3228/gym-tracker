import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import WorkoutPage from './pages/WorkoutPage'
import HistoryPage from './pages/HistoryPage'
import HomePage from './pages/HomePage'

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-slate-950 text-white">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/workout/:id" element={<WorkoutPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}
