export const useFormValidation = () => {
  const isEmailValid = (v: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  }

  const hasSpecialChar = (v: string) => {
    return /[^A-Za-z0-9]/.test(v)
  }

  const isPasswordValid = (v: string) => {
    return v.length >= 8 && hasSpecialChar(v)
  }

  const isNicknameValid = (v: string) => {
    return v.trim().length <= 5
  }

  const isBudgetValid = (v: string) => {
    return /^\d+$/.test(v)
  }

  const isExerciseValid = (v: string) => {
    return /^\d+$/.test(v)
  }

  return {
    isEmailValid,
    isPasswordValid,
    isNicknameValid,
    isBudgetValid,
    isExerciseValid,
  }
}
