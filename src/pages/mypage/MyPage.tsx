import { type FormEvent } from "react";
import { Helmet } from 'react-helmet-async'

import api, { buildApiUrl } from "@/api/api";

import { useAuthStore } from "@/stores/useAuthStore";

import Card from "@/components/card/Card";
import Input from "@/components/form/Form";

import editAvatar from "@/assets/icons/auth/edit-avatar.png";
import premiumCard from "@/assets/images/premium-card.png";

import { useMyPageForm, type InitialData } from "./hooks/useMyPageForm";
import { useProfileImage } from "./hooks/useProfileImage";
import { useUserData } from "./hooks/useUserData";
import { useFormValidation } from "./hooks/useFormValidation";

import styles from "./MyPage.module.css";

const DEFAULT_PROFILE = "https://placehold.co/120?text=Profile";

// ===== FORM FIELDS CONFIG =====
type FormFieldConfig = {
  name: "email" | "nickname";
  label: string;
  type: "email" | "text";
  hasButton: boolean;
  buttonText: string;
};

const LEFT_FORM_FIELDS: FormFieldConfig[] = [
  {
    name: "email",
    label: "이메일",
    type: "email",
    hasButton: true,
    buttonText: "중복 확인",
  },
  {
    name: "nickname",
    label: "닉네임",
    type: "text",
    hasButton: true,
    buttonText: "중복 확인",
  },
];

type RightFieldConfig = {
  name: "budget" | "exerciseGoal";
  label: string;
  unit: string;
};

const RIGHT_FORM_FIELDS: RightFieldConfig[] = [
  {
    name: "budget",
    label: "목표 예산(월 기준)",
    unit: "원",
  },
  {
    name: "exerciseGoal",
    label: "목표 운동 횟수(월 기준)",
    unit: "회",
  },
];

export default function MyPage() {
  // === 훅 사용 ===
  const { user, fetchMe } = useUserData();
  const {
    fileRef,
    profilePreview,
    profileError,
    handlePickProfile,
    handleProfileChange,
    resetProfile,
  } = useProfileImage();
  const validation = useFormValidation();

  // 초기값 계산
  const initialData: InitialData = {
    email: user?.email ?? "",
    nickname: user?.nickname ?? "",
    budget:
      user?.target_budget === null || user?.target_budget === undefined
        ? ""
        : String(user.target_budget),
    exerciseGoal:
      user?.target_exercise_count === null ||
        user?.target_exercise_count === undefined
        ? ""
        : String(user.target_exercise_count),
    premiumPoint: user?.premium_point ? `${user.premium_point}P` : "0P",
  };

  const form = useMyPageForm(initialData);

  // === 통합 handleFieldChange ===
  const handleFieldChange = (
    fieldName: "email" | "nickname" | "budget" | "exerciseGoal",
    value: string
  ) => {
    form.setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // 중복확인 상태 초기화
    if (fieldName === "email") {
      form.setEmailChecked(false);
    } else if (fieldName === "nickname") {
      form.setNicknameChecked(false);
    }

    // touched 업데이트
    form.setTouched((t) => ({ ...t, [fieldName]: true }));

    // validation 에러 업데이트
    if (!value.trim()) {
      form.setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
      return;
    }

    let errorMsg: string | undefined;
    switch (fieldName) {
      case "email":
        errorMsg = !validation.isEmailValid(value)
          ? "올바른 이메일 형식이 아니에요"
          : undefined;
        break;
      case "nickname":
        errorMsg = !validation.isNicknameValid(value)
          ? "5글자 이내로 입력해주세요"
          : undefined;
        break;
      case "budget":
        errorMsg = !validation.isBudgetValid(value)
          ? "숫자만 입력 가능해요"
          : undefined;
        break;
      case "exerciseGoal":
        errorMsg = !validation.isExerciseValid(value)
          ? "숫자만 입력 가능해요"
          : undefined;
        break;
    }

    form.setErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
  };

  // === 비번 변경 ===
  const handlePasswordChange = (
    fieldName: "password" | "passwordConfirm",
    value: string
  ) => {
    form.setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    form.setTouched((t) => ({ ...t, [fieldName]: true }));

    let errorMsg: string | undefined;

    if (fieldName === "password") {
      if (!value.trim()) {
        errorMsg = undefined;
      } else if (!validation.isPasswordValid(value)) {
        errorMsg = "비밀번호는 특수문자 포함 8자 이상이어야 합니다.";
      }

      // 비번 변경 시 확인도 체크
      if (
        form.formData.passwordConfirm.trim() &&
        value !== form.formData.passwordConfirm
      ) {
        form.setErrors((prev) => ({
          ...prev,
          password: errorMsg,
          passwordConfirm: "비밀번호가 일치하지 않습니다.",
        }));
        return;
      }
    } else if (fieldName === "passwordConfirm") {
      if (!form.formData.password.trim() && value.trim()) {
        errorMsg = "비밀번호를 먼저 입력해주세요.";
      } else if (form.formData.password.trim() && !value.trim()) {
        errorMsg = "비밀번호 확인을 입력해주세요.";
      } else if (
        form.formData.password.trim() &&
        value !== form.formData.password
      ) {
        errorMsg = "비밀번호가 일치하지 않습니다.";
      }
    }

    form.setErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
  };

  // === 중복 확인 핸들러 ===
  const handleCheck = (fieldName: "email" | "nickname") => {
    if (fieldName === "email") {
      if (!form.emailDirty || !validation.isEmailValid(form.formData.email)) {
        form.setErrors((prev) => ({
          ...prev,
          email: "올바른 이메일 형식이 아니에요",
        }));
        form.setTouched((t) => ({ ...t, email: true }));
        return;
      }
      alert("이메일 중복 확인이 완료되었어요");
      form.setEmailChecked(true);
    } else if (fieldName === "nickname") {
      if (!form.nicknameDirty) {
        form.setErrors((prev) => ({
          ...prev,
          nickname: "닉네임을 입력해주세요",
        }));
        form.setTouched((t) => ({ ...t, nickname: true }));
        return;
      }
      if (!validation.isNicknameValid(form.formData.nickname)) {
        form.setErrors((prev) => ({
          ...prev,
          nickname: "5글자 이내로 입력해주세요",
        }));
        form.setTouched((t) => ({ ...t, nickname: true }));
        return;
      }
      alert("닉네임 중복 확인이 완료되었어요");
      form.setNicknameChecked(true);
    }
  };

  // === API: updateMe ===
  const updateMe = async (
    payload: Record<string, string | number>,
    file?: File
  ) => {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error("토큰 없음");

    if (file) {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      formData.append("profile", file);

      return api.patch("/users/me", formData);
    }

    return api.patch("/users/me", payload);
  };

  // === Submit ===
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    form.setSubmitted(true);

    if (!form.canSubmit) {
      form.validate();
      return;
    }

    if (!form.validate()) return;

    const payload: Record<string, string | number> = {};
    if (form.emailDirty) payload.email = form.formData.email.trim();
    if (form.nicknameDirty) payload.nickname = form.formData.nickname.trim();
    if (form.budgetDirty) payload.target_budget = Number(form.formData.budget);
    if (form.exerciseDirty)
      payload.target_exercise_count = Number(form.formData.exerciseGoal);
    if (form.formData.password.trim())
      payload.password = form.formData.password;

    if (Object.keys(payload).length === 0) {
      alert("바뀐 내용이 없어요");
      return;
    }

    try {
      const file = fileRef.current?.files?.[0];
      await updateMe(payload, file);
      alert("바뀐 내용을 저장했어요");
      form.reset();
      resetProfile();
      await fetchMe();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "수정에 실패했어요";
      alert(errorMsg);
    }
  };

  return (
    <>
      <Helmet>
        <title>마이페이지 | Akkaworkout</title>
        <meta
          name="description"
          content="내 목표 예산, 운동 목표, 프로필 정보를 관리해 보세요."
        />
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
                  <div className={styles.profileArea}>
                    <div className={styles.avatar}>
                      <img
                        className={styles.avatarImg}
                        src={
                          profilePreview ??
                          (user?.profile_image_url &&
                            user.profile_image_url.trim()
                            ? `${buildApiUrl}${user.profile_image_url}`
                            : DEFAULT_PROFILE)
                        }
                        alt="프로필"
                        draggable={false}
                      />
                      <button
                        type="button"
                        className={styles.editAvatarBtn}
                        onClick={handlePickProfile}
                        aria-label="프로필 이미지 변경"
                      >
                        <img src={editAvatar} alt="profile-img-edit" draggable={false} />
                      </button>
                    </div>

                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className={styles.fileInput}
                      onChange={handleProfileChange}
                    />

                    {profileError && (
                      <p className={styles.profileError}>{profileError}</p>
                    )}
                  </div>

                  <div className={styles.profileToFormGap} />

                  <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                    autoComplete="off"
                  >
                    {/* === 이메일, 닉네임 (map으로 렌더링) === */}
                    {LEFT_FORM_FIELDS.map((field) => (
                      <Input
                        key={field.name}
                        label={field.label}
                        value={form.formData[field.name]}
                        onChange={(e) =>
                          handleFieldChange(field.name, e.target.value)
                        }
                        type={field.type}
                        errorText={
                          form.showError(field.name)
                            ? form.errors[field.name]
                            : undefined
                        }
                        rightButton={
                          field.hasButton
                            ? {
                              label: field.buttonText,
                              onClick: () => handleCheck(field.name),
                              disabled:
                                field.name === "email"
                                  ? !form.emailDirty ||
                                  !validation.isEmailValid(
                                    form.formData.email
                                  )
                                  : !form.nicknameDirty ||
                                  !validation.isNicknameValid(
                                    form.formData.nickname
                                  ),
                            }
                            : undefined
                        }
                      />
                    ))}

                    {/* === 비밀번호 === */}
                    <Input
                      label="비밀번호"
                      value={form.formData.password}
                      onChange={(e) =>
                        handlePasswordChange("password", e.target.value)
                      }
                      type="password"
                      placeholder="비밀번호 (특수문자 포함, 8자 이상)"
                      errorText={
                        form.showError("password")
                          ? form.errors.password
                          : undefined
                      }
                      showPasswordToggle={true}
                    />

                    {/* === 비밀번호 확인 === */}
                    <Input
                      label="비밀번호 확인"
                      value={form.formData.passwordConfirm}
                      onChange={(e) =>
                        handlePasswordChange("passwordConfirm", e.target.value)
                      }
                      type="password"
                      placeholder="비밀번호 확인"
                      errorText={
                        form.showError("passwordConfirm")
                          ? form.errors.passwordConfirm
                          : undefined
                      }
                      showPasswordToggle={true}
                    />

                    {/* === Submit 버튼 === */}
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
                                  className={`${styles.inputRight} ${form.showError(field.name) ? styles.inputError : ''
                                    }`}
                                  value={form.formData[field.name]}
                                  onChange={(e) =>
                                    handleFieldChange(field.name, e.target.value)
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
                    <div className={styles.premiumHeader}>
                      <div className={styles.premiumPoint}>
                        {initialData.premiumPoint}
                      </div>
                    </div>

                    <img
                      className={styles.premiumImg}
                      src={premiumCard}
                      alt="프리미엄 카드"
                    />
                  </Card>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}