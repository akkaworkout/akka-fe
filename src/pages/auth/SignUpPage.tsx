import { useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './SignUpPage.module.css'

import profileDefault from '../../assets/icons/profile-default.png'
import editAvatar from '../../assets/icons/edit-avatar.png'
import eyeOn from '../../assets/icons/icon-eye-on.png'
import eyeOff from '../../assets/icons/icon-eye-off.png'
import SideNav from '../../components/sideNav/SideNav'

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

  // profile image
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [profilePreview, setProfilePreview] = useState<string | null>(null)

  // form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [nickname, setNickname] = useState('')
  const [budget, setBudget] = useState('') // 목표 예산(월 기준)
  const [exerciseGoal, setExerciseGoal] = useState('') // 목표 운동 횟수(월 기준)

  // ui states
  const [showPw, setShowPw] = useState(false)
  const [showPwConfirm, setShowPwConfirm] = useState(false)

  const [errors, setErrors] = useState<FieldErrors>({})

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
    const url = URL.createObjectURL(file)
    setProfilePreview(url)
  }

  const isEmailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  const isPasswordValid = (v: string) => v.length >= 8
  const isNicknameValid = (v: string) => v.trim().length >= 2

  const validate = () => {
    const next: FieldErrors = {}

    if (!email.trim()) next.email = '이메일을 입력해주세요.'
    else if (!isEmailValid(email)) next.email = '올바른 이메일 형식이 아닙니다.'

    if (!password) next.password = '비밀번호를 입력해주세요.'
    else if (!isPasswordValid(password)) next.password = '비밀번호는 8자 이상이어야 합니다.'

    if (!passwordConfirm) next.passwordConfirm = '비밀번호 확인을 입력해주세요.'
    else if (passwordConfirm !== password) next.passwordConfirm = '비밀번호가 일치하지 않습니다.'

    if (!nickname.trim()) next.nickname = '닉네임을 입력해주세요.'
    else if (!isNicknameValid(nickname)) next.nickname = '닉네임은 2자 이상이어야 합니다.'

    if (budget && !/^\d+$/.test(budget)) next.budget = '숫자만 입력 가능합니다.'
    if (exerciseGoal && !/^\d+$/.test(exerciseGoal)) next.exerciseGoal = '숫자만 입력 가능합니다.'

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    alert('회원가입 완료! 로그인 페이지로 이동합니다.')
    nav('/login')
  }

  const canSubmit =
    isEmailValid(email) &&
    isPasswordValid(password) &&
    passwordConfirm === password &&
    isNicknameValid(nickname) &&
    (budget === '' || /^\d+$/.test(budget)) &&
    (exerciseGoal === '' || /^\d+$/.test(exerciseGoal))

  return (
    <div className={styles.wrap}>
      <SideNav />

      <main className={styles.main}>
        <div className={styles.mainInner}>
          <div className={styles.page}>
            <div className={styles.cardWrap}>
              <section className={styles.card}>
                {/* title */}
                <div className={styles.headerArea}>
                  <h1 className={styles.pageTitle}>회원가입</h1>
                </div>

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
                    className={styles.fileInput}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileChange}
                  />

                  {/* profile error */}
                  <p className={styles.error}>{errors.profile ?? ''}</p>
                </div>

                {/* form */}
                <form className={styles.form} onSubmit={handleSubmit}>
                  {/* email */}
                  <div className={styles.row}>
                    <label className={styles.label}>이메일</label>

                    <div className={styles.fieldLine}>
                      <div className={styles.inputWrap}>
                        <input
                          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="akka@naver.com"
                          inputMode="email"
                          autoComplete="email"
                        />
                        <p className={styles.error}>{errors.email ?? ''}</p>
                      </div>

                      <button type="button" className={styles.dupBtn}>
                        중복 확인
                      </button>
                    </div>
                  </div>

                  {/* password */}
                  <div className={styles.row}>
                    <label className={styles.label}>비밀번호</label>

                    <div className={styles.inputWrap}>
                      <div className={styles.inputWithIcon}>
                        <input
                          className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                          type={showPw ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="비밀번호 (특수문자 포함, 8자 이상)"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className={styles.iconBtn}
                          onClick={() => setShowPw((v) => !v)}
                          aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 보기'}
                        >
                          <img src={showPw ? eyeOn : eyeOff} alt="" draggable={false} />
                        </button>
                      </div>

                      <p className={styles.error}>{errors.password ?? ''}</p>
                    </div>
                  </div>

                  {/* password confirm */}
                  <div className={styles.row}>
                    <label className={styles.label}>비밀번호 확인</label>

                    <div className={styles.inputWrap}>
                      <div className={styles.inputWithIcon}>
                        <input
                          className={`${styles.input} ${errors.passwordConfirm ? styles.inputError : ''}`}
                          type={showPwConfirm ? 'text' : 'password'}
                          value={passwordConfirm}
                          onChange={(e) => setPasswordConfirm(e.target.value)}
                          placeholder="비밀번호 확인"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className={styles.iconBtn}
                          onClick={() => setShowPwConfirm((v) => !v)}
                          aria-label={showPwConfirm ? '비밀번호 숨기기' : '비밀번호 보기'}
                        >
                          <img src={showPwConfirm ? eyeOn : eyeOff} alt="" draggable={false} />
                        </button>
                      </div>

                      <p className={styles.error}>{errors.passwordConfirm ?? ''}</p>
                    </div>
                  </div>

                  {/* nickname */}
                  <div className={styles.row}>
                    <label className={styles.label}>닉네임</label>

                    <div className={styles.fieldLine}>
                      <div className={styles.inputWrap}>
                        <input
                          className={`${styles.input} ${errors.nickname ? styles.inputError : ''}`}
                          value={nickname}
                          onChange={(e) => setNickname(e.target.value)}
                          placeholder="5글자 이내로 입력해주세요."
                          autoComplete="nickname"
                        />
                        <p className={styles.error}>{errors.nickname ?? ''}</p>
                      </div>

                      <button type="button" className={styles.dupBtn}>
                        중복 확인
                      </button>
                    </div>
                  </div>

                  {/* budget */}
                  <div className={styles.row}>
                    <label className={styles.label}>목표 예산(월 기준)</label>

                    <div className={styles.inputWrap}>
                      <input
                        className={`${styles.input} ${errors.budget ? styles.inputError : ''}`}
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="120,000"
                        inputMode="numeric"
                      />
                      <p className={styles.error}>{errors.budget ?? ''}</p>
                    </div>
                  </div>

                  {/* exercise goal */}
                  <div className={styles.row}>
                    <label className={styles.label}>목표 운동 횟수(월 기준)</label>

                    <div className={styles.inputWrap}>
                      <input
                        className={`${styles.input} ${errors.exerciseGoal ? styles.inputError : ''}`}
                        value={exerciseGoal}
                        onChange={(e) => setExerciseGoal(e.target.value)}
                        placeholder="12"
                        inputMode="numeric"
                      />
                      <p className={styles.error}>{errors.exerciseGoal ?? ''}</p>
                    </div>
                  </div>

                  <div className={styles.submitArea}>
                    <button type="submit" className={styles.submitBtn} disabled={!canSubmit}>
                      회원가입
                    </button>
                  </div>
                </form>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}