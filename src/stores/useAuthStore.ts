import { create } from 'zustand'

const getStoredToken = () => {
  const token = localStorage.getItem('accessToken')

  if (!token || token === 'undefined' || token === 'null') {
    return null
  }

  return token
}

type AuthStore = {
  isLoggedIn: boolean
  token: string | null

  login: (token: string) => void
  logout: () => void
}

const storedToken = getStoredToken()

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: !!storedToken,
  token: storedToken,

  login: (token) => {
    localStorage.setItem('accessToken', token)

    set({
      isLoggedIn: true,
      token,
    })
  },

  logout: () => {
    localStorage.removeItem('accessToken')

    set({
      isLoggedIn: false,
      token: null,
    })
  },
}))