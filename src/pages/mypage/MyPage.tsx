import { useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import styles from './MyPage.module.css'

import SideNav from '../../components/sideNav/SideNav'

import profileDefault from '../../assets/icons/profile-default.png'
import editAvatar from '../../assets/icons/edit-avatar.png'
import eyeOn from '../../assets/icons/icon-eye-on.png'
import eyeOff from '../../assets/icons/icon-eye-off.png'
import premiumCard from '../../assets/images/premium-card.png'

type FieldErrors = Partial<{
    email: string
    password: string
    passwordConfirm: string
    nickname: string
    budget: string
    exerciseGoal: string
    profile: string
}>

type Touched = Partial<Record<keyof FieldErrors, boolean>>

const isEmailValid = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

const hasSpecialChar = (v: string) =>
    /[^A-Za-z0-9]/.test(v)

const isPasswordValid = (v: string) =>
    v.length >= 8 && hasSpecialChar(v)

export default function MyPage() {
    const initial = {
        email: 'akka@naver.com',
        nickname: '혜민',
        budget: '23000',
        exerciseGoal: '21',
        premiumPoint: '3,000P',
    }

    const [isSidebarFolded, setIsSidebarFolded] = useState(false)

    const fileRef = useRef<HTMLInputElement | null>(null)
    const [profilePreview, setProfilePreview] = useState<string | null>(null)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [nickname, setNickname] = useState('')
    const [budget, setBudget] = useState('')
    const [exerciseGoal, setExerciseGoal] = useState('')

    const [showPw, setShowPw] = useState(false)
    const [showPwConfirm, setShowPwConfirm] = useState(false)

    const [emailChecked, setEmailChecked] = useState(false)
    const [nicknameChecked, setNicknameChecked] = useState(false)

    const [errors, setErrors] = useState<FieldErrors>({})
    const [touched, setTouched] = useState<Touched>({})
    const [submitted, setSubmitted] = useState(false)

    const showError = (k: keyof FieldErrors) =>
        (submitted || touched[k]) && Boolean(errors[k])

    const validate = () => {
        const next: FieldErrors = {}

        if (!email.trim())
            next.email = '이메일을 입력해주세요.'
        else if (!isEmailValid(email))
            next.email = '올바른 이메일 형식이 아닙니다.'

        if (!password.trim())
            next.password = '비밀번호를 입력해주세요.'
        else if (!isPasswordValid(password))
            next.password = '비밀번호는 특수문자 포함 8자 이상이어야 합니다.'

        if (!passwordConfirm.trim())
            next.passwordConfirm = '비밀번호 확인을 입력해주세요.'
        else if (passwordConfirm !== password)
            next.passwordConfirm = '비밀번호가 일치하지 않습니다.'

        if (!nickname.trim())
            next.nickname = '닉네임을 입력해주세요.'
        else if (nickname.trim().length > 5)
            next.nickname = '5글자 이내로 입력해주세요.'

        if (!budget.trim())
            next.budget = '목표 예산을 입력해주세요.'
        else if (!/^\d+$/.test(budget))
            next.budget = '숫자만 입력 가능합니다.'

        if (!exerciseGoal.trim())
            next.exerciseGoal = '목표 운동 횟수를 입력해주세요.'
        else if (!/^\d+$/.test(exerciseGoal))
            next.exerciseGoal = '숫자만 입력 가능합니다.'

        setErrors(next)
        return Object.keys(next).length === 0
    }
    const passwordValid =
        !password.trim() ||
        (isPasswordValid(password) && passwordConfirm === password)

    const canSubmit = useMemo(() => {
        return (
            isEmailValid(email) &&
            nickname.trim().length > 0 &&
            nickname.trim().length <= 5 &&
            /^\d+$/.test(budget) &&
            /^\d+$/.test(exerciseGoal) &&
            passwordValid &&
            emailChecked &&
            nicknameChecked
        )
    }, [
        email,
        password,
        passwordConfirm,
        nickname,
        budget,
        exerciseGoal,
        emailChecked,
        nicknameChecked,
    ])

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        setSubmitted(true)

        if (!validate()) return
        if (!emailChecked || !nicknameChecked) return

        alert('수정 완료')
    }

    const handleEmailCheck = () => {
        if (!isEmailValid(email)) {
            setErrors(prev => ({
                ...prev,
                email: '올바른 이메일 형식이 아닙니다.',
            }))
            setTouched(t => ({ ...t, email: true }))
            return
        }
        alert('이메일 중복 확인')
        setEmailChecked(true)
    }

    const handleNicknameCheck = () => {
        if (!nickname.trim()) {
            setErrors(prev => ({
                ...prev,
                nickname: '닉네임을 입력해주세요.',
            }))
            setTouched(t => ({ ...t, nickname: true }))
            return
        }

        if (nickname.trim().length > 5) {
            setErrors(prev => ({
                ...prev,
                nickname: '5글자 이내로 입력해주세요.',
            }))
            setTouched(t => ({ ...t, nickname: true }))
            return
        }

        alert('닉네임 중복 확인')
        setNicknameChecked(true)
    }

    const handlePickProfile = () => fileRef.current?.click()

    const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            setErrors(prev => ({
                ...prev,
                profile: '이미지 파일만 업로드할 수 있습니다.',
            }))
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({
                ...prev,
                profile: '이미지 용량은 5MB 이하만 가능합니다.',
            }))
            return
        }

        setErrors(prev => ({ ...prev, profile: undefined }))
        setProfilePreview(URL.createObjectURL(file))
    }

    return (
        <div className={styles.wrap}>
            <SideNav
                folded={isSidebarFolded}
                onToggle={() => setIsSidebarFolded(p => !p)}
            />

            <main
                className={styles.main}
                style={{ marginLeft: isSidebarFolded ? 74 : 220 }}
            >
                <div className={styles.mainInner}>
                    <header className={styles.headerArea}>
                        <h1 className={styles.pageTitle}>마이페이지</h1>
                    </header>

                    <div className={styles.grid}>
                        <section className={styles.leftCard}>
                            <div className={styles.sectionTitle}>개인 정보 수정</div>

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

                                {errors.profile && (
                                    <p className={styles.profileError}>{errors.profile}</p>
                                )}
                            </div>

                            <div className={styles.profileToFormGap} />

                            <form
                                className={styles.form}
                                onSubmit={handleSubmit}
                                autoComplete="off"
                            >
                                {/* 이메일 */}
                                <div className={styles.row}>
                                    <label className={styles.label}>이메일</label>

                                    <div className={styles.fieldLine}>
                                        <div className={styles.inputWrap}>
                                            <input
                                                className={`${styles.input} ${showError('email')
                                                    ? styles.inputError
                                                    : ''
                                                    }`}
                                                value={email}
                                                placeholder={initial.email}
                                                onChange={(e) => {
                                                    const v = e.target.value
                                                    setEmail(v)
                                                    setEmailChecked(false)
                                                    setTouched(t => ({ ...t, email: true }))

                                                    setErrors(prev => ({
                                                        ...prev,
                                                        email:
                                                            !v.trim()
                                                                ? '이메일을 입력해주세요.'
                                                                : !isEmailValid(v)
                                                                    ? '올바른 이메일 형식이 아닙니다.'
                                                                    : undefined,
                                                    }))
                                                }}

                                                onBlur={() =>
                                                    setTouched(t => ({ ...t, email: true }))
                                                }
                                                autoComplete="off"
                                            />
                                            {showError('email') && (
                                                <p className={styles.error}>
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            className={styles.dupBtn}
                                            onClick={handleEmailCheck}
                                            disabled={!isEmailValid(email)}
                                        >
                                            중복 확인
                                        </button>
                                    </div>
                                </div>

                                {/* 비밀번호 */}
                                <div className={styles.row}>
                                    <label className={styles.label}>비밀번호</label>

                                    <div className={styles.fieldOnly}>
                                        <div className={styles.inputWrap}>
                                            <div className={styles.inputInner}>
                                                <input
                                                    className={`${styles.input} ${showError('password')
                                                        ? styles.inputError
                                                        : ''
                                                        }`}
                                                    type={showPw ? 'text' : 'password'}
                                                    value={password}
                                                    placeholder="비밀번호 (특수문자 포함, 8자 이상)"
                                                    onChange={(e) => {
                                                        const v = e.target.value
                                                        setPassword(v)
                                                        setTouched(t => ({ ...t, password: true }))

                                                        if (!v.trim()) {
                                                            setErrors(prev => ({ ...prev, password: undefined }))
                                                            return
                                                        }

                                                        setErrors(prev => ({
                                                            ...prev,
                                                            password: !isPasswordValid(v)
                                                                ? '비밀번호는 특수문자 포함 8자 이상이어야 합니다.'
                                                                : undefined,
                                                        }))
                                                    }}

                                                />

                                                <button
                                                    type="button"
                                                    className={styles.eyeBtn}
                                                    onClick={() =>
                                                        setShowPw(v => !v)
                                                    }
                                                >
                                                    <img
                                                        src={showPw ? eyeOn : eyeOff}
                                                        alt=""
                                                    />
                                                </button>
                                            </div>

                                            {showError('password') && (
                                                <p className={styles.error}>
                                                    {errors.password}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 비밀번호 확인 */}
                                <div className={styles.row}>
                                    <label className={styles.label}>
                                        비밀번호 확인
                                    </label>

                                    <div className={styles.fieldOnly}>
                                        <div className={styles.inputWrap}>
                                            <div className={styles.inputInner}>
                                                <input
                                                    className={`${styles.input} ${showError('passwordConfirm')
                                                        ? styles.inputError
                                                        : ''
                                                        }`}
                                                    type={
                                                        showPwConfirm
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    value={passwordConfirm}
                                                    placeholder="비밀번호 확인"
                                                    onChange={(e) => {
                                                        const v = e.target.value
                                                        setPasswordConfirm(v)
                                                        setTouched(t => ({ ...t, passwordConfirm: true }))

                                                        setErrors(prev => ({
                                                            ...prev,
                                                            passwordConfirm:
                                                                !password.trim() && v.trim()
                                                                    ? '비밀번호를 먼저 입력해주세요.'
                                                                    : password.trim() && !v.trim()
                                                                        ? '비밀번호 확인을 입력해주세요.'
                                                                        : password.trim() && v !== password
                                                                            ? '비밀번호가 일치하지 않습니다.'
                                                                            : undefined,
                                                        }))
                                                    }}

                                                />

                                                <button
                                                    type="button"
                                                    className={styles.eyeBtn}
                                                    onClick={() =>
                                                        setShowPwConfirm(v => !v)
                                                    }
                                                >
                                                    <img
                                                        src={
                                                            showPwConfirm
                                                                ? eyeOn
                                                                : eyeOff
                                                        }
                                                        alt=""
                                                    />
                                                </button>
                                            </div>

                                            {showError('passwordConfirm') && (
                                                <p className={styles.error}>
                                                    {errors.passwordConfirm}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 닉네임 */}
                                <div className={styles.row}>
                                    <label className={styles.label}>닉네임</label>

                                    <div className={styles.fieldLine}>
                                        <div className={styles.inputWrap}>
                                            <input
                                                className={`${styles.input} ${showError('nickname')
                                                    ? styles.inputError
                                                    : ''
                                                    }`}
                                                value={nickname}
                                                placeholder={initial.nickname}
                                                onChange={e => {
                                                    setNickname(e.target.value)
                                                    setNicknameChecked(false)
                                                    setTouched(t => ({
                                                        ...t,
                                                        nickname: true,
                                                    }))
                                                    if (submitted) validate()
                                                }}
                                                onBlur={() =>
                                                    setTouched(t => ({
                                                        ...t,
                                                        nickname: true,
                                                    }))
                                                }
                                            />
                                            {showError('nickname') && (
                                                <p className={styles.error}>
                                                    {errors.nickname}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            className={styles.dupBtn}
                                            onClick={handleNicknameCheck}
                                            disabled={
                                                nickname.trim().length === 0
                                            }
                                        >
                                            중복 확인
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.submitArea}>
                                    <button
                                        type="submit"
                                        className={`${styles.submitBtn} ${!canSubmit
                                            ? styles.submitDisabled
                                            : styles.submitActive
                                            }`}
                                    >
                                        완료
                                    </button>
                                </div>
                            </form>
                        </section>

                        <aside className={styles.rightCol}>
                            <section className={styles.rightCard}>
                                <div className={styles.sectionTitle}>
                                    개인 목표 설정
                                </div>

                                <div className={styles.rightInner}>
                                    <div className={styles.goalBlock}>
                                        <div className={styles.goalLabel}>
                                            목표 예산(월 기준)
                                        </div>
                                        <div className={styles.unitLine}>
                                            <div
                                                className={styles.inputWrapRight}
                                            >
                                                <input
                                                    className={`${styles.inputRight} ${showError('budget')
                                                        ? styles.inputError
                                                        : ''
                                                        }`}
                                                    value={budget}
                                                    placeholder={initial.budget}
                                                    onChange={e => {
                                                        setBudget(e.target.value)
                                                        setTouched(t => ({
                                                            ...t,
                                                            budget: true,
                                                        }))
                                                        if (submitted) validate()
                                                    }}
                                                />
                                                {showError('budget') && (
                                                    <p className={styles.error}>
                                                        {errors.budget}
                                                    </p>
                                                )}
                                            </div>
                                            <span className={styles.unit}>
                                                원
                                            </span>
                                        </div>
                                    </div>

                                    <div className={styles.goalBlock}>
                                        <div className={styles.goalLabel}>
                                            목표 운동 횟수(월 기준)
                                        </div>
                                        <div className={styles.unitLine}>
                                            <div
                                                className={styles.inputWrapRight}
                                            >
                                                <input
                                                    className={`${styles.inputRight} ${showError('exerciseGoal')
                                                        ? styles.inputError
                                                        : ''
                                                        }`}
                                                    value={exerciseGoal}
                                                    placeholder={
                                                        initial.exerciseGoal
                                                    }
                                                    onChange={e => {
                                                        setExerciseGoal(
                                                            e.target.value
                                                        )
                                                        setTouched(t => ({
                                                            ...t,
                                                            exerciseGoal: true,
                                                        }))
                                                        if (submitted) validate()
                                                    }}
                                                />
                                                {showError('exerciseGoal') && (
                                                    <p className={styles.error}>
                                                        {errors.exerciseGoal}
                                                    </p>
                                                )}
                                            </div>
                                            <span className={styles.unit}>
                                                회
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className={styles.premiumCard}>
                                <div className={styles.premiumHeader}>
                                    <div className={styles.premiumTitle}>
                                        프리미엄
                                    </div>
                                    <div className={styles.premiumPoint}>
                                        {initial.premiumPoint}
                                    </div>
                                </div>

                                <img
                                    className={styles.premiumImg}
                                    src={premiumCard}
                                    alt="프리미엄 카드"
                                />
                            </section>
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    )
}
