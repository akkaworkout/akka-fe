import { Routes, Route, Navigate } from 'react-router-dom'

import { useSidebarStore } from './stores/useSidebarStore'

import SideNav from './components/sideNav/SideNav'

import Main from './pages/main/Main'

import WorkoutHistoryPage from './pages/write/WorkoutHistoryPage'
import ExpenseHistoryPage from './pages/write/ExpenseHistoryPage'
import TicketHistoryPage from './pages/write/TicketHistoryPage'

import ReportPage from './pages/report/ReportPage'
import CalendarPage from './pages/calendar/CalendarPage'

import SignUpPage from './pages/auth/SignUpPage'
import LoginPage from './pages/auth/LoginPage'
import SignUpSuccessPage from './pages/auth/SignUpSuccessPage'

import MyPage from './pages/mypage/MyPage'

import styles from './App.module.css'

function App() {
  const { folded } = useSidebarStore()

  return (
    <div className={styles.layout}>
      <SideNav />

      <main
        className={`${styles.main} ${
          folded ? styles.mainFolded : ''
        }`}
      >
        <Routes>
          <Route path="/main" element={<Main />} />
          <Route path="/" element={<Navigate to="/main" replace />} />

          <Route path="/write" element={<WorkoutHistoryPage />} />
          <Route path="/expense" element={<ExpenseHistoryPage />} />
          <Route path="/ticket" element={<TicketHistoryPage />} />

          <Route path="/report" element={<ReportPage />} />
          <Route path="/calendar" element={<CalendarPage />} />

          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup/success" element={<SignUpSuccessPage />} />

          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App