import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../api/api'
import { flushSync } from 'react-dom'

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
    const token = localStorage.getItem('accessToken')
    if (!token) {
      setLoading(false)
      return null
    }

    try {
      setLoading(true)
      const json = await apiFetch('/users/me', { method: 'GET' })
      const me = json?.data ?? {}

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