import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

import { useAuthStore } from '@/stores/useAuthStore'

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://api.akkaworkout.store').replace(
  /\/$/,
  '',
)

export const buildApiUrl = (path: string) => {
  if (!path) return API_BASE_URL

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

type RefreshResponse = {
  data?: {
    accessToken?: string
  }
}

let refreshPromise: Promise<string> | null = null

const isAuthenticationRequest = (url?: string) =>
  ['/auth/login', '/auth/register', '/auth/refresh'].some((path) => url?.endsWith(path))

const refreshAccessToken = async () => {
  const { refreshToken, setAccessToken } = useAuthStore.getState()

  if (!refreshToken) {
    throw new Error('저장된 리프레시 토큰이 없습니다.')
  }

  const response = await refreshClient.post<RefreshResponse>('/auth/refresh', { refreshToken })
  const accessToken = response.data?.data?.accessToken

  if (!accessToken) {
    throw new Error('토큰 갱신 응답에 액세스 토큰이 없습니다.')
  }

  setAccessToken(accessToken)

  return accessToken
}

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthenticationRequest(originalRequest.url)
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null
        })
      }

      const accessToken = await refreshPromise

      originalRequest.headers.Authorization = `Bearer ${accessToken}`

      return api(originalRequest)
    } catch (refreshError) {
      useAuthStore.getState().logout()

      return Promise.reject(refreshError)
    }
  },
)

export default api
