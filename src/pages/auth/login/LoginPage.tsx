import { useMemo, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

import { useAuthStore } from '@/stores/useAuthStore'
import { authApi } from '@/api/authApi'

import Form from '@/components/form/Form'

import styles from './LoginPage.module.css'

type FieldErrors = Partial<{
  email: string
  password: string
}>

const isEmailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const hasSpecialChar = (v: string) => /[^A-Za-z0-9]/.test(v)
const isPasswordValid = (v: string) => v.length >= 8 && hasSpecialChar(v)

export default function LoginPage() {
  const nav = useNavigate()
  const { login } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const canSubmit = useMemo(() => {
    return email.trim() !== '' && password.trim() !== '' && !isLoading
  }, [email, password, isLoading])

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

    setIsLoading(true)

    try {
      const res = await authApi.login(email, password)

      console.log('LOGIN response:', res.data)

      const token = res.data?.data?.accessToken

      if (!token) {
        setErrors((prev) => ({
          ...prev,
          email: '토큰이 없습니다. 서버 응답을 확인해주세요.',
        }))
        return
      }

      login(token)

      console.log('Saved token:', token)

      alert('로그인이 완료되었어요')

      nav('/main')
    } catch (err: unknown) {
      console.error('LOGIN error:', err)

      let message = '로그인 실패'

      if (axios.isAxiosError(err)) {
        const status = err.response?.status

        message =
          err.response?.data?.message ||
          (status === 401 ? '이메일 또는 비밀번호가 올바르지 않습니다.' : '로그인 실패')
      }

      setErrors((prev) => ({
        ...prev,
        email: message,
        password: message,
      }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>로그인 | Akkaworkout</title>
        <meta
          name="description"
          content="Akkaworkout에 로그인하고 운동 기록과 이용권을 관리해 보세요."
        />
      </Helmet>

      <div className={styles.wrap}>
        <div className={styles.mainPage}>
          <div className={styles.mainInner}>
            <section className={styles.card}>
              <header className={styles.headerArea}>
                <h1 className={styles.pageTitle}>로그인</h1>
              </header>

              <form className={styles.form} onSubmit={handleSubmit}>
                <Form
                  label="이메일"
                  id="login-email"
                  value={email}
                  onChange={(e) => {
                    const v = e.target.value
                    setEmail(v)
                    setErrors((prev) => ({
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
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      const v = e.target.value
                      setPassword(v)
                      setErrors((prev) => ({ ...prev, password: undefined }))
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
                      className={`${styles.submitBtn} ${
                        !canSubmit ? styles.submitDisabled : styles.submitActive
                      }`}
                    >
                      {isLoading ? '로그인 중...' : '로그인'}
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
        </div>
      </div>
    </>
  )
}
