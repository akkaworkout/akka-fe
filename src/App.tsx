import { Routes, Route, Navigate } from 'react-router-dom'
import Main from './pages/main/Main'
import ReportPage from "./pages/report/ReportPage";

function App() {
  return (
    <Routes>
      {/* 메인 */}
      <Route path="/main" element={<Main />} />
      <Route path="/" element={<Navigate to="/main" replace />} />

      {/* 분석/리포트 */}
      <Route path="/report" element={<ReportPage />} />
    </Routes>
  )
}

export default App;