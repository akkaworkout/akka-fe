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

  // ✅ 실시간 기준으로 버튼 활성
  const canSubmit = useMemo(() => {
    return isEmailValid(email) && isPasswordValid(password)
  }, [email, password])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // ✅ 제출 시에도 현재값 검증해서 에러 띄우기
    const next: FieldErrors = {}
    if (!email.trim()) next.email = '이메일을 입력해주세요.'
    else if (!isEmailValid(email)) next.email = '올바른 이메일 형식이 아닙니다.'

    if (!password) next.password = '비밀번호를 입력해주세요.'
    else if (!isPasswordValid(password)) next.password = '올바른 비밀번호 형식이 아닙니다.'

    setErrors(next)
    if (Object.keys(next).length) return

    // ✅ 임시 로그인 실패(피그마)
    setErrors({
      email: '등록되지 않은 이메일입니다',
      password: '비밀번호가 일치하지 않습니다',
    })
  }

  return (
    <div className={styles.wrap}>
      <SideNav folded={isSidebarFolded} onToggle={() => setIsSidebarFolded(p => !p)} />

      <main
        className={styles.main}
      >
        <div className={styles.mainInner}>
          <section className={styles.card}>
            <header className={styles.headerArea}>
              <h1 className={styles.pageTitle}>로그인</h1>
            </header>

            <form className={styles.form} onSubmit={handleSubmit}>
              {/* ✅ 이메일 ↔ 비번 : 33은 form gap으로 해결 */}
              <Form
                label="이메일"
                value={email}
                onChange={(e) => {
                  const v = e.target.value
                  setEmail(v)
                  setErrors(prev => ({
                    ...prev,
                    email: v && !isEmailValid(v) ? '등록되지 않은 이메일입니다' : undefined,
                  }))
                }}
                placeholder="이메일"
                errorText={errors.email}
              />

              {/* ✅ 비번 ↔ 버튼 : 62는 아래 wrapper로 해결 */}
              <div className={styles.passwordBlock}>
                <Form
                  label="비밀번호"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    const v = e.target.value
                    setPassword(v)
                    setErrors(prev => ({
                      ...prev,
                      password:
                        !v ? '비밀번호를 입력해주세요.' :
                        !isPasswordValid(v) ? '비밀번호가 일치하지 않습니다' :
                        undefined,
                    }))
                  }}
                  placeholder="비밀번호"
                  showPasswordToggle
                  errorText={errors.password}
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