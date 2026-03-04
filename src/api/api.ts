export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.akkaworkout.store'

export const getToken = () => localStorage.getItem('accessToken')

export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = getToken()

  const headers = new Headers(init.headers || {})
  if (!(init.body instanceof FormData)) {
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  }
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers })
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data?.message || '요청 실패')
  }
  return data
}