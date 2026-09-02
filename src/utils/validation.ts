export const isEmailValid = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export const isPasswordValid = (value: string) => value.length >= 8 && /[^A-Za-z0-9]/.test(value)

export const isNicknameValid = (value: string) => {
  const length = value.trim().length

  return length > 0 && length <= 5
}

export const isNumericString = (value: string) => /^\d+$/.test(value)
