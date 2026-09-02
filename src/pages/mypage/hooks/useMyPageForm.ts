import { type FormEvent, type RefObject, useEffect, useState } from 'react'

import { updateMe, type UpdateMePayload } from '@/api/userApi'
import { isEmailValid, isNicknameValid, isNumericString, isPasswordValid } from '@/utils/validation'

export type FieldErrors = Partial<{
  email: string
  password: string
  passwordConfirm: string
  nickname: string
  budget: string
  exerciseGoal: string
}>

type Touched = Partial<Record<keyof FieldErrors, boolean>>

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

type FieldName = 'email' | 'nickname' | 'budget' | 'exerciseGoal'
type PasswordFieldName = 'password' | 'passwordConfirm'

type Params = {
  initialData: InitialData
  fileRef: RefObject<HTMLInputElement | null>
  resetProfile: () => void
  fetchMe: () => Promise<unknown>
}

export const useMyPageForm = ({ initialData, fileRef, resetProfile, fetchMe }: Params) => {
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

  useEffect(() => {
    setFormData({
      email: initialData.email,
      password: '',
      passwordConfirm: '',
      nickname: initialData.nickname,
      budget: initialData.budget,
      exerciseGoal: initialData.exerciseGoal,
    })
  }, [initialData.email, initialData.nickname, initialData.budget, initialData.exerciseGoal])

  const emailDirty = formData.email !== initialData.email
  const nicknameDirty = formData.nickname !== initialData.nickname
  const budgetDirty = formData.budget !== initialData.budget
  const exerciseDirty = formData.exerciseGoal !== initialData.exerciseGoal
  const passwordDirty =
    formData.password.trim().length > 0 || formData.passwordConfirm.trim().length > 0

  const emailOk = !emailDirty || isEmailValid(formData.email)
  const nicknameOk = !nicknameDirty || isNicknameValid(formData.nickname)
  const budgetOk = !budgetDirty || isNumericString(formData.budget)
  const exerciseOk = !exerciseDirty || isNumericString(formData.exerciseGoal)
  const passwordOk =
    !passwordDirty ||
    (isPasswordValid(formData.password) && formData.passwordConfirm === formData.password)
  const emailCheckOk = !emailDirty || emailChecked
  const nicknameCheckOk = !nicknameDirty || nicknameChecked
  const hasAnyChange = emailDirty || nicknameDirty || budgetDirty || exerciseDirty || passwordDirty
  const canSubmit =
    hasAnyChange &&
    emailOk &&
    nicknameOk &&
    budgetOk &&
    exerciseOk &&
    passwordOk &&
    emailCheckOk &&
    nicknameCheckOk

  const validate = () => {
    const next: FieldErrors = {}

    if (emailDirty) {
      if (!isEmailValid(formData.email)) next.email = '올바른 이메일 형식이 아닙니다.'
      else if (!emailChecked) next.email = '이메일 중복 확인을 해주세요.'
    }

    if (nicknameDirty) {
      if (!isNicknameValid(formData.nickname)) next.nickname = '5글자 이내로 입력해주세요.'
      else if (!nicknameChecked) next.nickname = '닉네임 중복 확인을 해주세요.'
    }

    if (budgetDirty && !isNumericString(formData.budget)) {
      next.budget = '숫자만 입력 가능합니다.'
    }

    if (exerciseDirty && !isNumericString(formData.exerciseGoal)) {
      next.exerciseGoal = '숫자만 입력 가능합니다.'
    }

    if (passwordDirty) {
      if (!formData.password.trim()) next.password = '비밀번호를 입력해주세요.'
      else if (!isPasswordValid(formData.password)) {
        next.password = '비밀번호는 특수문자 포함 8자 이상이어야 합니다.'
      }

      if (!formData.passwordConfirm.trim()) {
        next.passwordConfirm = '비밀번호 확인을 입력해주세요.'
      } else if (formData.passwordConfirm !== formData.password) {
        next.passwordConfirm = '비밀번호가 일치하지 않습니다.'
      }
    }

    setErrors(next)

    return Object.keys(next).length === 0
  }

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

  const handleFieldChange = (fieldName: FieldName, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))

    if (fieldName === 'email') {
      setEmailChecked(false)
    } else if (fieldName === 'nickname') {
      setNicknameChecked(false)
    }

    setTouched((prev) => ({ ...prev, [fieldName]: true }))

    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }))
      return
    }

    const validators: Record<FieldName, (fieldValue: string) => boolean> = {
      email: isEmailValid,
      nickname: isNicknameValid,
      budget: isNumericString,
      exerciseGoal: isNumericString,
    }
    const messages: Record<FieldName, string> = {
      email: '올바른 이메일 형식이 아니에요',
      nickname: '5글자 이내로 입력해주세요',
      budget: '숫자만 입력 가능해요',
      exerciseGoal: '숫자만 입력 가능해요',
    }

    setErrors((prev) => ({
      ...prev,
      [fieldName]: validators[fieldName](value) ? undefined : messages[fieldName],
    }))
  }

  const handlePasswordChange = (fieldName: PasswordFieldName, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
    setTouched((prev) => ({ ...prev, [fieldName]: true }))

    let errorMessage: string | undefined

    if (fieldName === 'password') {
      if (value.trim() && !isPasswordValid(value)) {
        errorMessage = '비밀번호는 특수문자 포함 8자 이상이어야 합니다.'
      }

      if (formData.passwordConfirm.trim() && value !== formData.passwordConfirm) {
        setErrors((prev) => ({
          ...prev,
          password: errorMessage,
          passwordConfirm: '비밀번호가 일치하지 않습니다.',
        }))
        return
      }
    } else if (!formData.password.trim() && value.trim()) {
      errorMessage = '비밀번호를 먼저 입력해주세요.'
    } else if (formData.password.trim() && !value.trim()) {
      errorMessage = '비밀번호 확인을 입력해주세요.'
    } else if (formData.password.trim() && value !== formData.password) {
      errorMessage = '비밀번호가 일치하지 않습니다.'
    }

    setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }))
  }

  const handleCheck = (fieldName: 'email' | 'nickname') => {
    const value = formData[fieldName]
    const dirty = fieldName === 'email' ? emailDirty : nicknameDirty
    const valid = fieldName === 'email' ? isEmailValid(value) : isNicknameValid(value)

    if (!dirty || !valid) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]:
          fieldName === 'email' ? '올바른 이메일 형식이 아니에요' : '5글자 이내로 입력해주세요',
      }))
      setTouched((prev) => ({ ...prev, [fieldName]: true }))
      return
    }

    alert(`${fieldName === 'email' ? '이메일' : '닉네임'} 중복 확인이 완료되었어요`)

    if (fieldName === 'email') setEmailChecked(true)
    else setNicknameChecked(true)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)

    if (!canSubmit) {
      validate()
      return
    }

    if (!validate()) return

    const payload: UpdateMePayload = {}

    if (emailDirty) payload.email = formData.email.trim()
    if (nicknameDirty) payload.nickname = formData.nickname.trim()
    if (budgetDirty) payload.target_budget = Number(formData.budget)
    if (exerciseDirty) payload.target_exercise_count = Number(formData.exerciseGoal)
    if (formData.password.trim()) payload.password = formData.password

    if (Object.keys(payload).length === 0) {
      alert('바뀐 내용이 없어요')
      return
    }

    try {
      const file = fileRef.current?.files?.[0]

      await updateMe(payload, file)
      alert('바뀐 내용을 저장했어요')

      reset()
      resetProfile()
      await fetchMe()
    } catch (error) {
      alert(error instanceof Error ? error.message : '수정에 실패했어요')
    }
  }

  return {
    formData,
    errors,
    canCheckEmail: emailDirty && isEmailValid(formData.email),
    canCheckNickname: nicknameDirty && isNicknameValid(formData.nickname),
    canSubmit,
    showError,
    handleFieldChange,
    handlePasswordChange,
    handleCheck,
    handleSubmit,
  }
}
