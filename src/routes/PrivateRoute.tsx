import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import api from '@/api/api'
import { useAuthStore } from '@/stores/useAuthStore'

import Spinner from '@/components/spinner/Spinner'

type Props = {
  children: React.ReactNode
}

const PrivateRoute = ({ children }: Props) => {
  const { token, logout } = useAuthStore()

  const [isChecking, setIsChecking] = useState(true)
  const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setIsAllowed(false)
        setIsChecking(false)
        return
      }

      try {
        await api.get('/users/me')

        setIsAllowed(true)
      } catch (error) {
        console.error('인증 확인 실패:', error)

        logout()
        setIsAllowed(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [token, logout])

  if (isChecking) {
    return <Spinner />
  }

  if (!isAllowed) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default PrivateRoute
