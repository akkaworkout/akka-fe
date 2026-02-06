import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LoginPage.module.css'

import SideNav from '../../components/sideNav/SideNav'
import Form from '../../components/common/form/Form'

type FieldErrors = Partial<{
  email: string
  password: string
}>

const isEmailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const hasSpecialChar = (v: string) => /[^A-Za-z0-9]/.test(v)
const isPasswordValid = (v: string) => v.length >= 8 && hasSpecialChar(v)

export default function LoginPage() {
  const nav = useNavigate()
  const [isSidebarFolded, setIsSidebarFolded] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})

  const [showPw, setShowPw] = useState(false)

  const canSubmit = useMemo(() => {
    return email.trim() !== '' && password.trim() !== ''
  }, [email, password])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: FieldErrors = {}

    if (email.trim() && !isEmailValid(email)) {
      next.email = '올바른 이메일 형식이 아닙니다'
    }

    if (!isPasswordValid(password)) {
      next.password = '비밀번호는 특수문자 포함 8자 이상이어야 합니다.'
    }

    setErrors(next)
    if (Object.keys(next).length > 0) return

    alert('로그인 성공했습니다')
    nav('/main')
  }

  return (
    <div className={styles.wrap}>
      <SideNav folded={isSidebarFolded} onToggle={() => setIsSidebarFolded(p => !p)} />

      <main className={styles.main}>
        <div className={styles.mainInner}>
          <section className={styles.card}>
            <header className={styles.headerArea}>
              <h1 className={styles.pageTitle}>로그인</h1>
            </header>

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
                placeholder="이메일"
                errorText={errors.email}
              />

              <div className={styles.passwordBlock}>
                <Form
                  label="비밀번호"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    const v = e.target.value
                    setPassword(v)
                    setErrors(prev => ({ ...prev, password: undefined }))
                  }}
                  placeholder="비밀번호 (특수문자 포함, 8자 이상)"
                  autoComplete="current-password"
                  errorText={errors.password}
                  showPasswordToggle
                />
              </div>

              <div className={styles.submitRow}>
                <div />
                <div className={styles.submitArea}>
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={`${styles.submitBtn} ${!canSubmit ? styles.submitDisabled : styles.submitActive}`}
                  >
                    로그인
                  </button>
                </div>
              </div>
            </form>

            <p className={styles.signupGuide}>
              아직 회원이 아니신가요?{' '}
              <span className={styles.signupLink} onClick={() => nav('/signup')}>
                회원가입
              </span>
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}