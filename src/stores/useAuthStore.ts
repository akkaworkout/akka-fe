import { create } from 'zustand'

type AuthStore = {
  isLoggedIn: boolean
  token: string | null

  login: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: !!localStorage.getItem('accessToken'),

  token: localStorage.getItem('accessToken'),

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