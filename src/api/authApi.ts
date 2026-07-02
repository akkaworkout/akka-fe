import api from './api'

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', {
      email: email.trim(),
      password,
    }),

  register: (formData: FormData) =>
    api.post('/auth/register', formData),

  checkEmail: (email: string) =>
    api.get('/auth/check-email', { params: { email } }),

  checkNickname: (nickname: string) =>
    api.get('/auth/check-nickname', { params: { nickname } }),
}