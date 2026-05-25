import { useState, useMemo } from 'react'
import { useFormValidation } from './useFormValidation'

export type FieldErrors = Partial<{
  email: string
  password: string
  passwordConfirm: string
  nickname: string
  budget: string
  exerciseGoal: string
}>

export type Touched = Partial<Record<keyof FieldErrors, boolean>>

export type FormData = {
  email: string
  password: string
  passwordConfirm: string
  nickname: string
  budget: string
  exerciseGoal: string
}

export type InitialData = {
  email: string
  nickname: string
  budget: string
  exerciseGoal: string
  premiumPoint: string
}

export const useMyPageForm = (initialData: InitialData) => {
  const validation = useFormValidation()

  const [formData, setFormData] = useState<FormData>({
    email: initialData.email,
    password: '',
    passwordConfirm: '',
    nickname: initialData.nickname,
    budget: initialData.budget,
    exerciseGoal: initialData.exerciseGoal,
  })

  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Touched>({})
  const [submitted, setSubmitted] = useState(false)
  const [emailChecked, setEmailChecked] = useState(false)
  const [nicknameChecked, setNicknameChecked] = useState(false)

  // === Dirty 체크 ===
  const emailDirty = formData.email !== initialData.email
  const nicknameDirty = formData.nickname !== initialData.nickname
  const budgetDirty = formData.budget !== initialData.budget
  const exerciseDirty = formData.exerciseGoal !== initialData.exerciseGoal
  const passwordDirty = formData.password.trim().length > 0 || formData.passwordConfirm.trim().length > 0

  // === 개별 검증 ===
  const emailOk = !emailDirty || validation.isEmailValid(formData.email)
  const nicknameOk = !nicknameDirty || validation.isNicknameValid(formData.nickname)
  const budgetOk = !budgetDirty || validation.isBudgetValid(formData.budget)
  const exerciseOk = !exerciseDirty || validation.isExerciseValid(formData.exerciseGoal)
  const passwordOk =
    !passwordDirty ||
    (validation.isPasswordValid(formData.password) && formData.passwordConfirm === formData.password)

  const emailCheckOk = !emailDirty || emailChecked
  const nicknameCheckOk = !nicknameDirty || nicknameChecked

  // === 전체 변경 여부 ===
  const hasAnyChange = emailDirty || nicknameDirty || budgetDirty || exerciseDirty || passwordDirty

  // === Submit 가능 여부 ===
  const canSubmit = useMemo(() => {
    return (
      hasAnyChange &&
      emailOk &&
      nicknameOk &&
      budgetOk &&
      exerciseOk &&
      passwordOk &&
      emailCheckOk &&
      nicknameCheckOk
    )
  }, [hasAnyChange, emailOk, nicknameOk, budgetOk, exerciseOk, passwordOk, emailCheckOk, nicknameCheckOk])

  // === Validation ===
  const validate = () => {
    const next: FieldErrors = {}

    if (emailDirty) {
      if (!validation.isEmailValid(formData.email)) next.email = '올바른 이메일 형식이 아닙니다.'
      else if (!emailChecked) next.email = '이메일 중복 확인을 해주세요.'
    }

    if (nicknameDirty) {
      if (!validation.isNicknameValid(formData.nickname))
        next.nickname = '5글자 이내로 입력해주세요.'
      else if (!nicknameChecked) next.nickname = '닉네임 중복 확인을 해주세요.'
    }

    if (budgetDirty) {
      if (!validation.isBudgetValid(formData.budget)) next.budget = '숫자만 입력 가능합니다.'
    }

    if (exerciseDirty) {
      if (!validation.isExerciseValid(formData.exerciseGoal))
        next.exerciseGoal = '숫자만 입력 가능합니다.'
    }

    if (passwordDirty) {
      if (!formData.password.trim()) next.password = '비밀번호를 입력해주세요.'
      else if (!validation.isPasswordValid(formData.password))
        next.password = '비밀번호는 특수문자 포함 8자 이상이어야 합니다.'

      if (!formData.passwordConfirm.trim())
        next.passwordConfirm = '비밀번호 확인을 입력해주세요.'
      else if (formData.passwordConfirm !== formData.password)
        next.passwordConfirm = '비밀번호가 일치하지 않습니다.'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  // === Reset ===
  const reset = () => {
    setFormData({
      email: initialData.email,
      password: '',
      passwordConfirm: '',
      nickname: initialData.nickname,
      budget: initialData.budget,
      exerciseGoal: initialData.exerciseGoal,
    })
    setErrors({})
    setTouched({})
    setSubmitted(false)
    setEmailChecked(false)
    setNicknameChecked(false)
  }

  const showError = (field: keyof FieldErrors) =>
    (submitted || touched[field]) && Boolean(errors[field])

  return {
    // 상태
    formData,
    setFormData,
    errors,
    setErrors,
    touched,
    setTouched,
    submitted,
    setSubmitted,
    emailChecked,
    setEmailChecked,
    nicknameChecked,
    setNicknameChecked,

    // Dirty 상태
    emailDirty,
    nicknameDirty,
    budgetDirty,
    exerciseDirty,
    passwordDirty,

    // 검증 상태
    emailOk,
    nicknameOk,
    budgetOk,
    exerciseOk,
    passwordOk,
    emailCheckOk,
    nicknameCheckOk,
    hasAnyChange,
    canSubmit,

    // 함수
    validate,
    reset,
    showError,
  }
}