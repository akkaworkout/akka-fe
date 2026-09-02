import { Helmet } from 'react-helmet-async'
import { MdPerson } from 'react-icons/md'

import styles from './MyPage.module.css'

import editAvatar from '@/assets/icons/auth/edit-avatar.png'
import premiumCard from '@/assets/images/premium-card.png'

import { buildApiUrl } from '@/api/api'

import Card from '@/components/card/Card'
import Input from '@/components/form/Form'

import {
  GoalSettingsContentSkeleton,
  PremiumContentSkeleton,
  ProfileFormContentSkeleton,
} from './components/MyPageContentSkeleton'

import { useMyPageForm } from './hooks/useMyPageForm'
import { useProfileImage } from './hooks/useProfileImage'
import { useUserData } from './hooks/useUserData'

import { getMyPageInitialData } from './utils/getMyPageInitialData'

// ===== FORM FIELDS CONFIG =====
type FormFieldConfig = {
  name: 'email' | 'nickname'
  label: string
  type: 'email' | 'text'
  hasButton: boolean
  buttonText: string
}

const LEFT_FORM_FIELDS: FormFieldConfig[] = [
  {
    name: 'email',
    label: '이메일',
    type: 'email',
    hasButton: true,
    buttonText: '중복 확인',
  },
  {
    name: 'nickname',
    label: '닉네임',
    type: 'text',
    hasButton: true,
    buttonText: '중복 확인',
  },
]

type RightFieldConfig = {
  name: 'budget' | 'exerciseGoal'
  label: string
  unit: string
}

const RIGHT_FORM_FIELDS: RightFieldConfig[] = [
  {
    name: 'budget',
    label: '목표 예산(월 기준)',
    unit: '원',
  },
  {
    name: 'exerciseGoal',
    label: '목표 운동 횟수(월 기준)',
    unit: '회',
  },
]

export default function MyPage() {
  // === 훅 사용 ===
  const { user, loading: userLoading, fetchMe } = useUserData()
  const {
    fileRef,
    profilePreview,
    profileError,
    handlePickProfile,
    handleProfileChange,
    resetProfile,
  } = useProfileImage()
  // 초기값 계산
  const initialData = getMyPageInitialData(user)
  const profileImageSrc =
    profilePreview ?? (user?.profile_image_url?.trim() ? buildApiUrl(user.profile_image_url) : null)

  const form = useMyPageForm({
    initialData,
    fileRef,
    resetProfile,
    fetchMe,
  })

  return (
    <>
      <Helmet>
        <title>마이페이지 | Akkaworkout</title>
        <meta name="description" content="내 목표 예산, 운동 목표, 프로필 정보를 관리해 보세요." />
      </Helmet>

      <div className={styles.wrap}>
        <div className={styles.main}>
          <div className={styles.mainInner}>
            <header className={styles.headerArea}>
              <h1 className={styles.pageTitle}>마이페이지</h1>
            </header>

            <div className={styles.grid}>
              {/* === 왼쪽 카드: 개인 정보 수정 === */}
              <div className={styles.leftCard}>
                <Card
                  title="개인 정보 수정"
                  width={665}
                  height={783}
                  backgroundColor="#ffffff"
                  radius={20}
                >
                  {userLoading ? (
                    <ProfileFormContentSkeleton />
                  ) : (
                    <>
                      <div className={styles.profileArea}>
                        <div className={styles.avatar}>
                          {profileImageSrc ? (
                            <img
                              className={styles.avatarImg}
                              src={profileImageSrc}
                              alt="프로필"
                              draggable={false}
                            />
                          ) : (
                            <div
                              className={styles.defaultAvatar}
                              role="img"
                              aria-label="기본 프로필"
                            >
                              <MdPerson className={styles.defaultAvatarIcon} aria-hidden="true" />
                            </div>
                          )}
                          <button
                            type="button"
                            className={styles.editAvatarBtn}
                            onClick={handlePickProfile}
                            aria-label="프로필 이미지 변경"
                          >
                            <img src={editAvatar} alt="프로필 이미지 수정" draggable={false} />
                          </button>
                        </div>

                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/*"
                          className={styles.fileInput}
                          onChange={handleProfileChange}
                        />

                        {profileError && <p className={styles.profileError}>{profileError}</p>}
                      </div>

                      <div className={styles.profileToFormGap} />

                      <form className={styles.form} onSubmit={form.handleSubmit} autoComplete="off">
                        {LEFT_FORM_FIELDS.map((field) => (
                          <Input
                            key={field.name}
                            id={`mypage-${field.name}`}
                            label={field.label}
                            value={form.formData[field.name]}
                            onChange={(e) => form.handleFieldChange(field.name, e.target.value)}
                            type={field.type}
                            variant="profile"
                            errorText={
                              form.showError(field.name) ? form.errors[field.name] : undefined
                            }
                            rightButton={
                              field.hasButton
                                ? {
                                    label: field.buttonText,
                                    onClick: () => form.handleCheck(field.name),
                                    disabled:
                                      field.name === 'email'
                                        ? !form.canCheckEmail
                                        : !form.canCheckNickname,
                                  }
                                : undefined
                            }
                          />
                        ))}

                        <Input
                          id="mypage-password"
                          label="비밀번호"
                          value={form.formData.password}
                          onChange={(e) => form.handlePasswordChange('password', e.target.value)}
                          type="password"
                          variant="profile"
                          placeholder="비밀번호 (특수문자 포함, 8자 이상)"
                          errorText={form.showError('password') ? form.errors.password : undefined}
                          showPasswordToggle={true}
                        />

                        <Input
                          id="mypage-password-confirm"
                          label="비밀번호 확인"
                          value={form.formData.passwordConfirm}
                          onChange={(e) =>
                            form.handlePasswordChange('passwordConfirm', e.target.value)
                          }
                          type="password"
                          variant="profile"
                          placeholder="비밀번호 확인"
                          errorText={
                            form.showError('passwordConfirm')
                              ? form.errors.passwordConfirm
                              : undefined
                          }
                          showPasswordToggle={true}
                        />

                        <div className={styles.submitArea}>
                          <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={!form.canSubmit}
                          >
                            완료
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </Card>
              </div>

              {/* === 오른쪽 사이드 === */}
              <aside className={styles.rightCol}>
                {/* === 목표 설정 === */}
                <div className={styles.rightCard}>
                  <Card
                    title="개인 목표 설정"
                    width={325}
                    height={312}
                    backgroundColor="#ffffff"
                    radius={20}
                  >
                    {userLoading ? (
                      <GoalSettingsContentSkeleton />
                    ) : (
                      <div className={styles.rightInner}>
                        {RIGHT_FORM_FIELDS.map((field) => {
                          const inputId = `mypage-${field.name}`

                          return (
                            <div key={field.name} className={styles.goalBlock}>
                              <label className={styles.goalLabel} htmlFor={inputId}>
                                {field.label}
                              </label>

                              <div className={styles.unitLine}>
                                <div className={styles.inputWrapRight}>
                                  <input
                                    id={inputId}
                                    className={`${styles.inputRight} ${
                                      form.showError(field.name) ? styles.inputError : ''
                                    }`}
                                    value={form.formData[field.name]}
                                    onChange={(e) =>
                                      form.handleFieldChange(field.name, e.target.value)
                                    }
                                    type="number"
                                  />
                                </div>

                                <span className={styles.unit}>{field.unit}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </Card>
                </div>

                {/* === 프리미엄 === */}
                <div className={styles.premiumCard}>
                  <Card
                    title="프리미엄"
                    width={325}
                    height={439}
                    backgroundColor="#ffffff"
                    radius={20}
                  >
                    {userLoading ? (
                      <PremiumContentSkeleton />
                    ) : (
                      <>
                        <div className={styles.premiumHeader}>
                          <div className={styles.premiumPoint}>{initialData.premiumPoint}</div>
                        </div>

                        <img className={styles.premiumImg} src={premiumCard} alt="프리미엄 카드" />
                      </>
                    )}
                  </Card>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
