import api from './api'

export type UpdateMePayload = Record<string, string | number>

export const updateMe = async (payload: UpdateMePayload, file?: File) => {
  if (file) {
    const formData = new FormData()

    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, String(value))
    })

    formData.append('profile', file)

    return api.patch('/users/me', formData)
  }

  return api.patch('/users/me', payload)
}
