import api from './api'

type LoginResponse = {
  success: boolean
  message: string
  data: {
    accessToken: string
    refreshToken: string
  }
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', {
      email: email.trim(),
      password,
    }),

  register: (formData: FormData) => api.post('/auth/register', formData),

  checkEmail: (email: string) => api.get('/auth/check-email', { params: { email } }),

  checkNickname: (nickname: string) => api.get('/auth/check-nickname', { params: { nickname } }),
}
