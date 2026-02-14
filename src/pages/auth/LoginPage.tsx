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

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      const res = await fetch(
        'https://port-0-akka-workout-be-mkqkv57u21e615f4.sel3.cloudtype.app/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      )

      const data = await res.json().catch(() => ({}))

      // 콘솔로 확인
      console.log('LOGIN status:', res.status)
      console.log('LOGIN response:', data)

      if (!res.ok) {
        // 서버가 message를 주면 그거 쓰고, 없으면 기본 문구
        setErrors(prev => ({
          ...prev,
          email: data?.message || '로그인 실패',
        }))
        return
      }

      const token = data?.data?.token

      if (token) {
        localStorage.setItem('accessToken', token)
        console.log('Saved token:', token)
      } else {
        console.log('No token in response. Check backend response shape.')
      }

      nav('/main')
    } catch (err) {
      console.error('LOGIN fetch error:', err)
      setErrors(prev => ({
        ...prev,
        email: '네트워크 오류가 발생했습니다. 서버/주소를 확인해주세요.',
      }))
    }
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