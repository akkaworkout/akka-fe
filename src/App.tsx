import { Routes, Route, Navigate } from 'react-router-dom'
import Main from './pages/main/Main'

import WorkoutHistoryPage from "./pages/write/WorkoutHistoryPage";
import ExpenseHistoryPage from "./pages/write/ExpenseHistoryPage";
import TicketHistoryPage from './pages/write/TicketHistoryPage';

import ReportPage from "./pages/report/ReportPage";

import CalendarPage from "./pages/calendar/CalendarPage";

import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpSuccessPage from './pages/auth/SignUpSuccessPage'

function App() {
  return (
    <Routes>
      {/* 메인 */}
      <Route path="/main" element={<Main />} />
      <Route path="/" element={<Navigate to="/main" replace />} />

      {/* 운동기록 */}
      <Route path="/write" element={<WorkoutHistoryPage />} />
      <Route path="/expense" element={<ExpenseHistoryPage />} />
      <Route path="/ticket" element={<TicketHistoryPage />} />

      {/* 분석/리포트 */}
      <Route path="/report" element={<ReportPage />} />

      {/* 캘린더 */}
      <Route path="/calendar" element={<CalendarPage />} />

      {/* 로그인/회원가입 */}
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup/success" element={<SignUpSuccessPage />} />
    </Routes>
  )
}

export default App;