import { useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './SignUpPage.module.css'

import profileDefault from '../../assets/icons/profile-default.png'
import editAvatar from '../../assets/icons/edit-avatar.png'

import SideNav from '../../components/sideNav/SideNav'
import Form from '../../components/common/form/Form'

type FieldErrors = Partial<{
  email: string
  password: string
  passwordConfirm: string
  nickname: string
  budget: string
  exerciseGoal: string
  profile: string
}>

export default function SignUpPage() {
  const nav = useNavigate()

  /* ================= 상태 ================= */

  // profile
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [profilePreview, setProfilePreview] = useState<string | null>(null)

  // form values
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [nickname, setNickname] = useState('')
  const [budget, setBudget] = useState('')
  const [exerciseGoal, setExerciseGoal] = useState('')

  // ui
  const [showPw, setShowPw] = useState(false)
  const [showPwConfirm, setShowPwConfirm] = useState(false)
  const [isSidebarFolded, setIsSidebarFolded] = useState(false)

  // errors
  const [errors, setErrors] = useState<FieldErrors>({})

  /* ================= 유틸 ================= */

  const isEmailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  const hasSpecialChar = (v: string) => /[^A-Za-z0-9]/.test(v) // 특수문자 
  const isPasswordValid = (v: string) => v.length >= 8 && hasSpecialChar(v)

  const isNicknameValid = (v: string) => v.trim().length >= 2

  const getErrors = () => {
    const next: FieldErrors = {}

    if (!email.trim()) next.email = '이메일을 입력해주세요.'
    else if (!isEmailValid(email)) next.email = '올바른 이메일 형식이 아닙니다.'

    if (!password) next.password = '비밀번호를 입력해주세요.'
    else if (!isPasswordValid(password))
      next.password = '올바른 비밀번호 형식이 아닙니다.'


    if (!passwordConfirm)
      next.passwordConfirm = '비밀번호 확인을 입력해주세요.'
    else if (passwordConfirm !== password)
      next.passwordConfirm = '비밀번호가 일치하지 않습니다.'

    if (!nickname.trim()) next.nickname = '닉네임을 입력해주세요.'
    else if (!isNicknameValid(nickname))
      next.nickname = '닉네임은 2자 이상이어야 합니다.'

    if (budget && !/^\d+$/.test(budget))
      next.budget = '숫자만 입력 가능합니다.'

    if (exerciseGoal && !/^\d+$/.test(exerciseGoal))
      next.exerciseGoal = '숫자만 입력 가능합니다.'

    return next
  }

  const validate = () => {
    const next = getErrors()
    setErrors(next)
    return Object.keys(next).length === 0
  }

  /* ================= 이벤트 ================= */

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    alert('회원가입 완료!')
    nav('/signup/success')
  }

  const handlePickProfile = () => {
    fileRef.current?.click()
  }

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, profile: '이미지 파일만 업로드할 수 있습니다.' }))
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, profile: '이미지 용량은 5MB 이하만 가능합니다.' }))
      return
    }

    setErrors((prev) => ({ ...prev, profile: undefined }))
    setProfilePreview(URL.createObjectURL(file))
  }

  const canSubmit =
    isEmailValid(email) &&
    isPasswordValid(password) &&
    password === passwordConfirm &&
    isNicknameValid(nickname) &&
    budget.trim() !== '' &&
    /^\d+$/.test(budget) &&
    exerciseGoal.trim() !== '' &&
    /^\d+$/.test(exerciseGoal)


  /* ================= 렌더 ================= */

  return (
    <div className={styles.wrap}>
      <SideNav
        folded={isSidebarFolded}
        onToggle={() => setIsSidebarFolded((prev) => !prev)}
      />


      <main
        className={styles.main}
        style={{ marginLeft: isSidebarFolded ? 74 : 220 }}
      >
        <div className={styles.mainInner}>
          <section className={styles.card}>
            <header className={styles.headerArea}>
              <h1 className={styles.pageTitle}>회원가입</h1>
            </header>

            {/* profile */}
            <div className={styles.profileArea}>
              <div className={styles.avatar}>
                <img
                  className={styles.avatarImg}
                  src={profilePreview ?? profileDefault}
                  alt="프로필"
                  draggable={false}
                />
                <button
                  type="button"
                  className={styles.editAvatarBtn}
                  onClick={handlePickProfile}
                  aria-label="프로필 사진 수정"
                >
                  <img src={editAvatar} alt="" draggable={false} />
                </button>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className={styles.fileInput}
                onChange={handleProfileChange}
              />
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <Form
                label="이메일"
                value={email}
                onChange={(e) => {
                  const v = e.target.value
                  setEmail(v)

                  setErrors(prev => ({
                    ...prev,
                    email: v && !isEmailValid(v) ? '올바른 이메일 형식이 아닙니다' : undefined,
                  }))
                }}
                placeholder="akka@naver.com"
                autoComplete="email"
                errorText={errors.email}
                rightButton={{
                  label: '중복 확인',
                  onClick: () => alert('이메일 중복 확인 (임시)'),
                  disabled: !isEmailValid(email),
                }}
              />


              <Form
                label="비밀번호"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  const v = e.target.value
                  setPassword(v)

                  setErrors(prev => {
                    const next: FieldErrors = { ...prev }

                    // password 실시간 검증
                    if (!v) next.password = '비밀번호를 입력해주세요.'
                    else if (!isPasswordValid(v))
                      next.password = '비밀번호는 특수문자 포함 8자 이상이어야 합니다.'
                    else next.password = undefined

                    // 비밀번호가 바뀌면 확인 값도 같이 체크
                    if (passwordConfirm) {
                      next.passwordConfirm =
                        passwordConfirm !== v ? '비밀번호가 일치하지 않습니다.' : undefined
                    }

                    return next
                  })
                }}

                placeholder="비밀번호 (특수문자 포함, 8자 이상)"
                autoComplete="new-password"
                showPasswordToggle
                errorText={errors.password}
              />

              <Form
                label="비밀번호 확인"
                value={passwordConfirm}
                onChange={(e) => {
                  const v = e.target.value
                  setPasswordConfirm(v)

                  setErrors(prev => ({
                    ...prev,
                    passwordConfirm:
                      v && v !== password ? '비밀번호가 일치하지 않습니다' : undefined,
                  }))
                }}
                placeholder="비밀번호 (특수문자 포함, 8자 이상)"
                type={showPwConfirm ? 'text' : 'password'}
                showPasswordToggle
                errorText={errors.passwordConfirm}
              />


              <Form
                label="닉네임"
                value={nickname}
                onChange={(e) => {
                  const v = e.target.value
                  setNickname(v)

                  // 입력 중에는 에러 안 띄움
                  setErrors(prev => ({ ...prev, nickname: undefined }))
                }}
                placeholder="5글자 이내로 입력해주세요"
                errorText={undefined}
                rightButton={{
                  label: '중복 확인',
                  onClick: () => {
                    const v = nickname.trim()

                    if (v.length === 0) {
                      alert('닉네임을 입력해주세요')
                      return
                    }

                    if (v.length > 5) {
                      alert('5글자 이내로 입력해주세요')
                      return
                    }

                    alert('사용 가능한 닉네임입니다 (임시)')
                  },
                  disabled: nickname.trim().length === 0,
                }}
              />



              <Form
                label="목표 예산(월 기준)"
                value={budget}
                onChange={(e) => {
                  const v = e.target.value
                  setBudget(v)

                  setErrors(prev => ({
                    ...prev,
                    budget:
                      v && !/^\d+$/.test(v)
                        ? '숫자만 입력 가능합니다'
                        : undefined,
                  }))
                }}
                inputMode="numeric"
                placeholder="120,000"
                errorText={errors.budget}
              />

              <Form
                label="목표 운동 횟수(월 기준)"
                value={exerciseGoal}
                onChange={(e) => {
                  const v = e.target.value
                  setExerciseGoal(v)

                  setErrors(prev => ({
                    ...prev,
                    exerciseGoal:
                      v && !/^\d+$/.test(v)
                        ? '숫자만 입력 가능합니다'
                        : undefined,
                  }))
                }}
                inputMode="numeric"
                placeholder="12"
                errorText={errors.exerciseGoal}
              />


              <div className={styles.submitRow}>
                <div /> {/* 라벨 칸 비움 */}
                <div className={styles.submitArea}>
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={`${styles.submitBtn} ${!canSubmit ? styles.submitDisabled : styles.submitActive
                      }`}
                  >
                    회원가입
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  )
}