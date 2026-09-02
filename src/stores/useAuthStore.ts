import { create } from 'zustand'

const getStoredToken = (key: 'accessToken' | 'refreshToken') => {
  const token = localStorage.getItem(key)

  if (!token || token === 'undefined' || token === 'null') {
    return null
  }

  return token
}

type AuthStore = {
  isLoggedIn: boolean
  token: string | null
  refreshToken: string | null

  login: (token: string, refreshToken: string) => void
  setAccessToken: (token: string) => void
  logout: () => void
}

const storedToken = getStoredToken('accessToken')
const storedRefreshToken = getStoredToken('refreshToken')

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: !!storedToken,
  token: storedToken,
  refreshToken: storedRefreshToken,

  login: (token, refreshToken) => {
    localStorage.setItem('accessToken', token)
    localStorage.setItem('refreshToken', refreshToken)

    set({
      isLoggedIn: true,
      token,
      refreshToken,
    })
  },

  setAccessToken: (token) => {
    localStorage.setItem('accessToken', token)

    set({
      isLoggedIn: true,
      token,
    })
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')

    set({
      isLoggedIn: false,
      token: null,
      refreshToken: null,
    })
  },
}))
