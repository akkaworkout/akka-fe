import { Routes, Route, Navigate } from 'react-router-dom'
import Main from './pages/main/Main'

import WorkoutHistoryPage from "./pages/write/WorkoutHistoryPage";

import ReportPage from "./pages/report/ReportPage";

import CalendarPage from "./pages/calendar/CalendarPage";

import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";


function App() {
  return (
    <Routes>
      {/* 메인 */}
      <Route path="/main" element={<Main />} />
      <Route path="/" element={<Navigate to="/main" replace />} />
      
      {/* 운동기록 */}
      <Route path="/write" element={<WorkoutHistoryPage />} />

      {/* 분석/리포트 */}
      <Route path="/report" element={<ReportPage />} />

      {/* 캘린더 */}
      <Route path="/calendar" element={<CalendarPage />} />

      {/* 로그인/회원가입 */}
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default App;