import { Routes, Route, Navigate } from 'react-router-dom'

import PrivateRoute from '@/routes/PrivateRoute'

import { useSidebarStore } from '@/stores/useSidebarStore'

import SideNav from '@/components/sideNav/SideNav'

import Main from '@/pages/main/MainPage'

import WorkoutPage from '@/pages/records/workout/WorkoutPage'
import ExpensePage from '@/pages/records/expense/ExpensePage'
import TicketPage from '@/pages/records/ticket/TicketPage'

import ReportPage from '@/pages/report/ReportPage'
import CalendarPage from '@/pages/calendar/CalendarPage'

import LoginPage from '@/pages/auth/login/LoginPage'
import SignUpPage from '@/pages/auth/signup/SignUpPage'
import SignUpSuccessPage from '@/pages/auth/signup/SignUpSuccessPage'

import MyPage from '@/pages/mypage/MyPage'

import styles from '@/App.module.css'

function App() {
  const { folded } = useSidebarStore();

  return (
    <div className={styles.layout}>
      <SideNav />

      <main
        className={`${styles.main} ${folded ? styles.mainFolded : ''}`}
      >
        <Routes>
          <Route path="/main" element={<Main />} />
          <Route path="/" element={<Navigate to="/main" replace />} />
          <Route
            path="/write"
            element={
              <PrivateRoute>
                <WorkoutPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/expense"
            element={
              <PrivateRoute>
                <ExpensePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/ticket"
            element={
              <PrivateRoute>
                <TicketPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/report"
            element={
              <PrivateRoute>
                <ReportPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <PrivateRoute>
                <CalendarPage />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/signup/success"
            element={<SignUpSuccessPage />}
          />
          <Route
            path="/mypage"
            element={
              <PrivateRoute>
                <MyPage />
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={<Navigate to="/main" replace />}
          />
        </Routes>
      </main>
    </div>
  )
}

export default App