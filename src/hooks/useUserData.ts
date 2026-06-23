import { useState, useEffect, useCallback } from 'react'
import { flushSync } from 'react-dom'

import api from '../api/api'

import { useAuthStore } from '@/stores/useAuthStore'

export type User = {
  id?: number
  email?: string
  nickname?: string
  profile_image_url?: string
  target_budget?: number
  target_exercise_count?: number
  points?: number
  premium_point?: number
}

export const useUserData = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchMe = useCallback(async () => {
    const token = useAuthStore.getState().token;

    if (!token) {
      setLoading(false)
      return null
    }

    try {
      setLoading(true)

      const { data } = await api.get('/users/me')

      const me = data?.data ?? {}

      flushSync(() => {
        setUser(me)
      })

      return me
    } catch (err) {
      console.error('내 정보 조회 실패:', err)

      setUser(null)

      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMe()
  }, [fetchMe])

  return {
    user,
    loading,
    fetchMe,
  }
}