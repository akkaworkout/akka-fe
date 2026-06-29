import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

import styles from './SignUpPage.module.css'

import profileDefault from '@/assets/icons/auth/profile-default.png'
import editAvatar from '@/assets/icons/auth/edit-avatar.png'

import Form from '@/components/form/Form'
import { useSignUpForm } from '@/hooks/useSignUpForm'
import { authApi } from '@/api/authApi'

export default function SignUpPage() {
  const nav = useNavigate()
  const form = useSignUpForm()

  const handlePickProfile = () => {
    form.fileRef.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!form.validate()) return

    if (!form.emailChecked || !form.emailAvailable) {
      form.setErrors((prev) => ({
        ...prev,
        email: '이메일 중복확인을 해주세요.',
      }))
      return
    }

    if (!form.nicknameChecked || !form.nicknameAvailable) {
      form.setErrors((prev) => ({
        ...prev,
        nickname: '닉네임 중복확인을 해주세요.',
      }))
      return
    }

    form.setIsLoading(true)

    try {
      const formData = new FormData()

      formData.append('email', form.email)
      formData.append('password', form.password)
      formData.append('nickname', form.nickname)
      formData.append('target_budget', String(Number(form.budget)))
      formData.append('target_exercise_count', String(Number(form.exerciseGoal)))

      if (form.profileFile) {
        formData.append('profile', form.profileFile)
      }

      await authApi.register(formData)

      alert('가입이 완료됐어요')

      nav('/signup/success', {
        state: { nickname: form.nickname },
      })
    } catch (err) {
      console.error(err)
      alert('가입에 실패했어요. 다시 시도해 주세요')
    } finally {
      form.setIsLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>회원가입 | Akkaworkout</title>
        <meta
          name="description"
          content="Akkaworkout에 가입하고 운동 루틴과 지출을 함께 관리해 보세요."
        />
      </Helmet>

      <div className={styles.wrap}>
        <div className={styles.main}>
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
                    src={form.profilePreview ?? profileDefault}
                    alt="프로필"
                    draggable={false}
                  />
                  <button
                    type="button"
                    className={styles.editAvatarBtn}
                    onClick={handlePickProfile}
                    aria-label="프로필 사진 수정"
                  >
                    <img
                      src={editAvatar}
                      alt="profile-img-edit"
                      draggable={false}
                    />
                  </button>
                </div>

                <input
                  ref={form.fileRef}
                  type="file"
                  accept="image/*"
                  className={styles.fileInput}
                  onChange={form.handleProfileChange}
                />
              </div>

              <form className={styles.form} onSubmit={handleSubmit}>
                <Form
                  label="이메일"
                  id="signup-email"
                  value={form.email}
                  onChange={(e) => {
                    const v = e.target.value
                    form.setEmail(v)

                    form.setEmailChecked(false)
                    form.setEmailAvailable(false)

                    form.setErrors((prev) => ({
                      ...prev,
                      email:
                        v && !form.isEmailValid(v)
                          ? '올바른 이메일 형식이 아닙니다'
                          : undefined,
                    }))
                  }}
                  placeholder="akka@naver.com"
                  autoComplete="email"
                  errorText={form.errors.email}
                  rightButton={{
                    label: '중복 확인',
                    onClick: form.handleCheckEmail,
                    disabled:
                      !form.isEmailValid(form.email) ||
                      (form.emailChecked && form.emailAvailable),
                  }}
                />

                <Form
                  label="비밀번호"
                  id="signup-password"
                  type="password"
                  value={form.password}
                  onChange={(e) => {
                    const v = e.target.value
                    form.setPassword(v)

                    form.setErrors((prev) => {
                      const next = { ...prev }

                      if (!v) next.password = '비밀번호를 입력해주세요.'
                      else if (!form.isPasswordValid(v))
                        next.password =
                          '비밀번호는 특수문자 포함 8자 이상이어야 합니다.'
                      else next.password = undefined

                      if (form.passwordConfirm) {
                        next.passwordConfirm =
                          form.passwordConfirm !== v
                            ? '비밀번호가 일치하지 않습니다.'
                            : undefined
                      }

                      return next
                    })
                  }}
                  placeholder="비밀번호 (특수문자 포함, 8자 이상)"
                  autoComplete="new-password"
                  showPasswordToggle
                  errorText={form.errors.password}
                />

                <Form
                  label="비밀번호 확인"
                  id="signup-password-confirm"
                  value={form.passwordConfirm}
                  onChange={(e) => {
                    const v = e.target.value
                    form.setPasswordConfirm(v)
                    form.setErrors((prev) => ({
                      ...prev,
                      passwordConfirm:
                        v && v !== form.password
                          ? '비밀번호가 일치하지 않습니다'
                          : undefined,
                    }))
                  }}
                  placeholder="비밀번호 (특수문자 포함, 8자 이상)"
                  type="password"
                  showPasswordToggle
                  errorText={form.errors.passwordConfirm}
                />

                <Form
                  label="닉네임"
                  id="signup-nickname"
                  value={form.nickname}
                  onChange={(e) => {
                    const v = e.target.value
                    form.setNickname(v)

                    form.setNicknameChecked(false)
                    form.setNicknameAvailable(false)

                    form.setErrors((prev) => ({ ...prev, nickname: undefined }))
                  }}
                  placeholder="5글자 이내로 입력해주세요"
                  errorText={form.errors.nickname}
                  rightButton={{
                    label: '중복 확인',
                    onClick: form.handleCheckNickname,
                    disabled:
                      form.nickname.trim().length === 0 ||
                      (form.nicknameChecked && form.nicknameAvailable),
                  }}
                />

                <Form
                  label="목표 예산(월 기준)"
                  id="signup-budget-goal"
                  value={form.budget}
                  onChange={(e) => {
                    const v = e.target.value
                    form.setBudget(v)
                    form.setErrors((prev) => ({
                      ...prev,
                      budget:
                        v && !/^[1-9]\d*$/.test(v)
                          ? '1 이상의 숫자만 입력 가능합니다'
                          : undefined,
                    }))
                  }}
                  inputMode="numeric"
                  placeholder="120000"
                  errorText={form.errors.budget}
                />

                <Form
                  label="목표 운동 횟수(월 기준)"
                  id="signup-exercise-goal"
                  value={form.exerciseGoal}
                  onChange={(e) => {
                    const v = e.target.value
                    form.setExerciseGoal(v)
                    form.setErrors((prev) => ({
                      ...prev,
                      exerciseGoal:
                        v && !/^[1-9]\d*$/.test(v)
                          ? '1 이상의 숫자만 입력 가능합니다'
                          : undefined,
                    }))
                  }}
                  inputMode="numeric"
                  placeholder="12"
                  errorText={form.errors.exerciseGoal}
                />

                <div className={styles.submitRow}>
                  <div />
                  <div className={styles.submitArea}>
                    <button
                      type="submit"
                      disabled={!form.canSubmit}
                      className={`${styles.submitBtn} ${
                        !form.canSubmit
                          ? styles.submitDisabled
                          : styles.submitActive
                      }`}
                    >
                      {form.isLoading ? '가입 중...' : '회원가입'}
                    </button>
                  </div>
                </div>
              </form>

              <p className={styles.signupGuide}>
                이미 계정이 있으신가요?{' '}
                <span
                  className={styles.signupLink}
                  onClick={() => nav('/login')}
                >
                  로그인
                </span>
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}