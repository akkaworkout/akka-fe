import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { authApi } from '@/api/authApi'
import { isEmailValid, isPasswordValid } from '@/utils/validation'

type FieldErrors = Partial<{
  email: string
  password: string
  passwordConfirm: string
  nickname: string
  budget: string
  exerciseGoal: string
  profile: string
}>

export const useSignUpForm = () => {
  // profile
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const [profileFile, setProfileFile] = useState<File | null>(null)

  // form values
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [nickname, setNickname] = useState('')
  const [budget, setBudget] = useState('')
  const [exerciseGoal, setExerciseGoal] = useState('')

  // errors
  const [errors, setErrors] = useState<FieldErrors>({})

  // duplicate check
  const [emailChecked, setEmailChecked] = useState(false)
  const [emailAvailable, setEmailAvailable] = useState(false)
  const [nicknameChecked, setNicknameChecked] = useState(false)
  const [nicknameAvailable, setNicknameAvailable] = useState(false)

  // isLoading
  const [isLoading, setIsLoading] = useState(false)

  /* ================= 유틸 ================= */

  const isNicknameValid = (v: string) => v.trim().length >= 2

  const getErrors = () => {
    const next: FieldErrors = {}

    if (!email.trim()) next.email = '이메일을 입력해주세요.'
    else if (!isEmailValid(email)) next.email = '올바른 이메일 형식이 아닙니다.'

    if (!password) next.password = '비밀번호를 입력해주세요.'
    else if (!isPasswordValid(password))
      next.password = '비밀번호는 특수문자 포함 8자 이상이어야 합니다.'

    if (!passwordConfirm) next.passwordConfirm = '비밀번호 확인을 입력해주세요.'
    else if (passwordConfirm !== password) next.passwordConfirm = '비밀번호가 일치하지 않습니다.'

    if (!nickname.trim()) next.nickname = '닉네임을 입력해주세요.'
    else if (!isNicknameValid(nickname)) next.nickname = '닉네임은 2자 이상이어야 합니다.'

    if (!budget.trim()) next.budget = '목표 예산을 입력해주세요.'
    else if (!/^\d+$/.test(budget)) next.budget = '숫자만 입력 가능합니다.'
    else if (Number(budget) <= 0) next.budget = '0보다 큰 숫자를 입력해주세요.'

    if (!exerciseGoal.trim()) next.exerciseGoal = '목표 운동 횟수를 입력해주세요.'
    else if (!/^\d+$/.test(exerciseGoal)) next.exerciseGoal = '숫자만 입력 가능합니다.'
    else if (Number(exerciseGoal) <= 0) next.exerciseGoal = '0보다 큰 숫자를 입력해주세요.'

    return next
  }

  const validate = () => {
    const next = getErrors()
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleCheckEmail = async () => {
    if (!isEmailValid(email)) {
      setErrors((prev) => ({
        ...prev,
        email: '올바른 이메일 형식이 아닙니다.',
      }))
      return
    }

    setIsLoading(true)

    try {
      const { data } = await authApi.checkEmail(email)

      setEmailChecked(true)
      setEmailAvailable(data.available)

      setErrors((prev) => ({
        ...prev,
        email: data.available ? undefined : '이미 사용 중인 이메일이에요',
      }))

      if (data.available) {
        alert('사용 가능한 이메일이에요')
      }
    } catch (err) {
      console.error(err)

      setErrors((prev) => ({
        ...prev,
        email: '이메일 중복확인 중 오류가 발생했어요',
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckNickname = async () => {
    const v = nickname.trim()

    if (v.length === 0) {
      setErrors((prev) => ({
        ...prev,
        nickname: '닉네임을 입력해주세요',
      }))
      return
    }

    if (v.length > 5) {
      setErrors((prev) => ({
        ...prev,
        nickname: '5글자 이내로 입력해주세요',
      }))
      return
    }

    setIsLoading(true)

    try {
      const { data } = await authApi.checkNickname(v)

      setNicknameChecked(true)
      setNicknameAvailable(data.available)

      setErrors((prev) => ({
        ...prev,
        nickname: data.available ? undefined : '이미 사용 중인 닉네임이에요',
      }))

      if (data.available) {
        alert('사용 가능한 닉네임이에요')
      }
    } catch (err) {
      console.error(err)

      setErrors((prev) => ({
        ...prev,
        nickname: '닉네임 중복확인 중 오류가 발생했습니다.',
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({
        ...prev,
        profile: '이미지 파일만 업로드할 수 있습니다.',
      }))
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        profile: '이미지 용량은 5MB 이하만 가능합니다.',
      }))
      return
    }

    setErrors((prev) => ({ ...prev, profile: undefined }))
    setProfileFile(file)
    setProfilePreview(URL.createObjectURL(file))
  }

  const canSubmit =
    isEmailValid(email) &&
    emailChecked &&
    emailAvailable &&
    isPasswordValid(password) &&
    password === passwordConfirm &&
    isNicknameValid(nickname) &&
    nicknameChecked &&
    nicknameAvailable &&
    budget.trim() !== '' &&
    /^\d+$/.test(budget) &&
    Number(budget) > 0 &&
    exerciseGoal.trim() !== '' &&
    /^\d+$/.test(exerciseGoal) &&
    Number(exerciseGoal) > 0 &&
    !isLoading

  return {
    // profile
    profilePreview,
    profileFile,
    // form values
    email,
    setEmail,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    nickname,
    setNickname,
    budget,
    setBudget,
    exerciseGoal,
    setExerciseGoal,
    // errors
    errors,
    setErrors,
    // duplicate check
    emailChecked,
    setEmailChecked,
    emailAvailable,
    setEmailAvailable,
    nicknameChecked,
    setNicknameChecked,
    nicknameAvailable,
    setNicknameAvailable,
    // loading
    isLoading,
    setIsLoading,
    // validation
    isEmailValid,
    isPasswordValid,
    isNicknameValid,
    getErrors,
    validate,
    // handlers
    handleCheckEmail,
    handleCheckNickname,
    handleProfileChange,
    canSubmit,
  }
}
