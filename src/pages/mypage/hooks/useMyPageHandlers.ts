import { type FormEvent, type RefObject } from 'react'

import { updateMe, type UpdateMePayload } from '@/api/userApi'

import type { FieldErrors, FormData } from './useMyPageForm'

type Validation = {
  isEmailValid: (value: string) => boolean
  isPasswordValid: (value: string) => boolean
  isNicknameValid: (value: string) => boolean
  isBudgetValid: (value: string) => boolean
  isExerciseValid: (value: string) => boolean
}

type MyPageForm = {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  errors: FieldErrors
  setErrors: React.Dispatch<React.SetStateAction<FieldErrors>>
  setTouched: React.Dispatch<React.SetStateAction<Partial<Record<keyof FieldErrors, boolean>>>>
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>

  emailChecked: boolean
  setEmailChecked: React.Dispatch<React.SetStateAction<boolean>>
  nicknameChecked: boolean
  setNicknameChecked: React.Dispatch<React.SetStateAction<boolean>>

  emailDirty: boolean
  nicknameDirty: boolean
  budgetDirty: boolean
  exerciseDirty: boolean
  canSubmit: boolean

  validate: () => boolean
  reset: () => void
}

type FieldName = 'email' | 'nickname' | 'budget' | 'exerciseGoal'
type PasswordFieldName = 'password' | 'passwordConfirm'

type Params = {
  form: MyPageForm
  validation: Validation
  fileRef: RefObject<HTMLInputElement | null>
  resetProfile: () => void
  fetchMe: () => Promise<void>
}

export const useMyPageHandlers = ({ form, validation, fileRef, resetProfile, fetchMe }: Params) => {
  const handleFieldChange = (fieldName: FieldName, value: string) => {
    form.setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))

    if (fieldName === 'email') {
      form.setEmailChecked(false)
    } else if (fieldName === 'nickname') {
      form.setNicknameChecked(false)
    }

    form.setTouched((t) => ({ ...t, [fieldName]: true }))

    if (!value.trim()) {
      form.setErrors((prev) => ({ ...prev, [fieldName]: undefined }))
      return
    }

    let errorMsg: string | undefined

    switch (fieldName) {
      case 'email':
        errorMsg = !validation.isEmailValid(value) ? '올바른 이메일 형식이 아니에요' : undefined
        break
      case 'nickname':
        errorMsg = !validation.isNicknameValid(value) ? '5글자 이내로 입력해주세요' : undefined
        break
      case 'budget':
        errorMsg = !validation.isBudgetValid(value) ? '숫자만 입력 가능해요' : undefined
        break
      case 'exerciseGoal':
        errorMsg = !validation.isExerciseValid(value) ? '숫자만 입력 가능해요' : undefined
        break
    }

    form.setErrors((prev) => ({ ...prev, [fieldName]: errorMsg }))
  }

  const handlePasswordChange = (fieldName: PasswordFieldName, value: string) => {
    form.setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))

    form.setTouched((t) => ({ ...t, [fieldName]: true }))

    let errorMsg: string | undefined

    if (fieldName === 'password') {
      if (!value.trim()) {
        errorMsg = undefined
      } else if (!validation.isPasswordValid(value)) {
        errorMsg = '비밀번호는 특수문자 포함 8자 이상이어야 합니다.'
      }

      if (form.formData.passwordConfirm.trim() && value !== form.formData.passwordConfirm) {
        form.setErrors((prev) => ({
          ...prev,
          password: errorMsg,
          passwordConfirm: '비밀번호가 일치하지 않습니다.',
        }))
        return
      }
    } else if (fieldName === 'passwordConfirm') {
      if (!form.formData.password.trim() && value.trim()) {
        errorMsg = '비밀번호를 먼저 입력해주세요.'
      } else if (form.formData.password.trim() && !value.trim()) {
        errorMsg = '비밀번호 확인을 입력해주세요.'
      } else if (form.formData.password.trim() && value !== form.formData.password) {
        errorMsg = '비밀번호가 일치하지 않습니다.'
      }
    }

    form.setErrors((prev) => ({ ...prev, [fieldName]: errorMsg }))
  }

  const handleCheck = (fieldName: 'email' | 'nickname') => {
    if (fieldName === 'email') {
      if (!form.emailDirty || !validation.isEmailValid(form.formData.email)) {
        form.setErrors((prev) => ({
          ...prev,
          email: '올바른 이메일 형식이 아니에요',
        }))
        form.setTouched((t) => ({ ...t, email: true }))
        return
      }

      alert('이메일 중복 확인이 완료되었어요')
      form.setEmailChecked(true)
    } else if (fieldName === 'nickname') {
      if (!form.nicknameDirty) {
        form.setErrors((prev) => ({
          ...prev,
          nickname: '닉네임을 입력해주세요',
        }))
        form.setTouched((t) => ({ ...t, nickname: true }))
        return
      }

      if (!validation.isNicknameValid(form.formData.nickname)) {
        form.setErrors((prev) => ({
          ...prev,
          nickname: '5글자 이내로 입력해주세요',
        }))
        form.setTouched((t) => ({ ...t, nickname: true }))
        return
      }

      alert('닉네임 중복 확인이 완료되었어요')
      form.setNicknameChecked(true)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    form.setSubmitted(true)

    if (!form.canSubmit) {
      form.validate()
      return
    }

    if (!form.validate()) return

    const payload: UpdateMePayload = {}

    if (form.emailDirty) payload.email = form.formData.email.trim()
    if (form.nicknameDirty) payload.nickname = form.formData.nickname.trim()
    if (form.budgetDirty) payload.target_budget = Number(form.formData.budget)
    if (form.exerciseDirty) {
      payload.target_exercise_count = Number(form.formData.exerciseGoal)
    }
    if (form.formData.password.trim()) {
      payload.password = form.formData.password
    }

    if (Object.keys(payload).length === 0) {
      alert('바뀐 내용이 없어요')
      return
    }

    try {
      const file = fileRef.current?.files?.[0]

      await updateMe(payload, file)
      alert('바뀐 내용을 저장했어요')

      form.reset()
      resetProfile()
      await fetchMe()
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '수정에 실패했어요'
      alert(errorMsg)
    }
  }

  return {
    handleFieldChange,
    handlePasswordChange,
    handleCheck,
    handleSubmit,
  }
}
