import axios from 'axios'

import { useAuthStore } from '@/stores/useAuthStore'

export const API_BASE_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '')

export const buildApiUrl = (path: string) => {
  if (!path) return API_BASE_URL

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api