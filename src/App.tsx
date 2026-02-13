import { Routes, Route, Navigate } from 'react-router-dom'
import Main from './pages/main/Main'



import SignUpPage from './pages/auth/SignUpPage'
import LoginPage from './pages/auth/LoginPage'
import SignUpSuccessPage from './pages/auth/SignUpSuccessPage'

import MyPage from './pages/mypage/MyPage'

function App() {
  return (
    <Routes>
      {/* 메인 */}
      <Route path="/main" element={<Main />} />
      <Route path="/" element={<Navigate to="/main" replace />} />


      {/* 로그인/회원가입 */}
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup/success" element={<SignUpSuccessPage />} />

      {/* 마이페이지 */}
      <Route path="/mypage" element={<MyPage />} />
    </Routes>
  )
}

export default App