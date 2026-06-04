import { useState, type FormEvent } from "react";
import styles from "./MyPage.module.css";

import Card from "@/components/common/Card";

import profileDefault from "@/assets/icons/profile-default.png";
import editAvatar from "@/assets/icons/edit-avatar.png";
import eyeOn from "@/assets/icons/icon-eye-on.png";
import eyeOff from "@/assets/icons/icon-eye-off.png";
import premiumCard from "@/assets/images/premium-card.png";

import { apiFetch } from "@/api/api";
import { useMyPageForm, type InitialData } from "@/hooks/useMyPageForm";
import { useProfileImage } from "@/hooks/useProfileImage";
import { useUserData } from "@/hooks/useUserData";
import { useFormValidation } from "@/hooks/useFormValidation";

const API_BASE = import.meta.env.VITE_API_URL;

export default function MyPage() {
  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);

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

  // === API: updateMe ===
  const updateMe = async (
    payload: Record<string, string | number>,
    file?: File,
  ) => {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("토큰 없음");

    // 파일이 있으면 FormData
    if (file) {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      formData.append("profile", file);

      return apiFetch("/users/me", {
        method: "PATCH",
        body: formData,
      });
    }

    // 파일 없으면 JSON
    return apiFetch("/users/me", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
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
    if (form.formData.password.trim()) payload.password = form.formData.password;

    if (Object.keys(payload).length === 0) {
      alert("수정할 값이 없습니다.");
      return;
    }

    try {
      const file = fileRef.current?.files?.[0];
      await updateMe(payload, file);
      alert("수정 완료");
      form.reset();
      resetProfile();
      await fetchMe();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "수정 실패";
      alert(errorMsg);
    }
  };

  // === 중복 확인 ===
  const handleEmailCheck = () => {
    if (!form.emailDirty || !validation.isEmailValid(form.formData.email)) {
      form.setErrors((prev) => ({
        ...prev,
        email: "올바른 이메일 형식이 아닙니다.",
      }));
      form.setTouched((t) => ({ ...t, email: true }));
      return;
    }

    alert("이메일 중복 확인");
    form.setEmailChecked(true);
  };

  const handleNicknameCheck = () => {
    if (!form.nicknameDirty) {
      form.setErrors((prev) => ({
        ...prev,
        nickname: "닉네임을 입력해주세요.",
      }));
      form.setTouched((t) => ({ ...t, nickname: true }));
      return;
    }

    if (!validation.isNicknameValid(form.formData.nickname)) {
      form.setErrors((prev) => ({
        ...prev,
        nickname: "5글자 이내로 입력해주세요.",
      }));
      form.setTouched((t) => ({ ...t, nickname: true }));
      return;
    }

    alert("닉네임 중복 확인");
    form.setNicknameChecked(true);
  };

  return (
    <div className={styles.wrap}>
      <main className={styles.main}>
        <div className={styles.mainInner}>
          <header className={styles.headerArea}>
            <h1 className={styles.pageTitle}>마이페이지</h1>
          </header>

          <div className={styles.grid}>
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
                        (user?.profile_image_url
                          ? `${API_BASE}${user.profile_image_url}`
                          : profileDefault)
                      }
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
                  {/* === 이메일 === */}
                  <div className={styles.row}>
                    <label className={styles.label}>이메일</label>

                    <div className={styles.fieldLine}>
                      <div className={styles.inputWrap}>
                        <input
                          className={`${styles.input} ${form.showError("email") ? styles.inputError : ""
                            }`}
                          value={form.formData.email}
                          onChange={(e) => {
                            const v = e.target.value;
                            form.setFormData((prev) => ({
                              ...prev,
                              email: v,
                            }));
                            form.setEmailChecked(false);
                            form.setTouched((t) => ({ ...t, email: true }));

                            form.setErrors((prev) => ({
                              ...prev,
                              email: !v.trim()
                                ? undefined
                                : !validation.isEmailValid(v)
                                  ? "올바른 이메일 형식이 아닙니다."
                                  : undefined,
                            }));
                          }}
                          onBlur={() =>
                            form.setTouched((t) => ({ ...t, email: true }))
                          }
                          autoComplete="off"
                        />
                        {form.showError("email") && (
                          <p className={styles.error}>{form.errors.email}</p>
                        )}
                      </div>

                      <button
                        type="button"
                        className={styles.dupBtn}
                        onClick={handleEmailCheck}
                        disabled={
                          !form.emailDirty ||
                          !validation.isEmailValid(form.formData.email)
                        }
                      >
                        중복 확인
                      </button>
                    </div>
                  </div>

                  {/* === 비밀번호 === */}
                  <div className={styles.row}>
                    <label className={styles.label}>비밀번호</label>

                    <div className={styles.fieldOnly}>
                      <div className={styles.inputWrap}>
                        <div className={styles.inputInner}>
                          <input
                            className={`${styles.input} ${form.showError("password")
                                ? styles.inputError
                                : ""
                              }`}
                            type={showPw ? "text" : "password"}
                            value={form.formData.password}
                            placeholder="비밀번호 (특수문자 포함, 8자 이상)"
                            onChange={(e) => {
                              const v = e.target.value;
                              form.setFormData((prev) => ({
                                ...prev,
                                password: v,
                              }));
                              form.setTouched((t) => ({
                                ...t,
                                password: true,
                              }));

                              form.setErrors((prev) => ({
                                ...prev,
                                password: !v.trim()
                                  ? undefined
                                  : !validation.isPasswordValid(v)
                                    ? "비밀번호는 특수문자 포함 8자 이상이어야 합니다."
                                    : undefined,
                                passwordConfirm:
                                  form.formData.passwordConfirm.trim() &&
                                    v !== form.formData.passwordConfirm
                                    ? "비밀번호가 일치하지 않습니다."
                                    : prev.passwordConfirm,
                              }));
                            }}
                          />

                          <button
                            type="button"
                            className={styles.eyeBtn}
                            onClick={() => setShowPw((v) => !v)}
                          >
                            <img src={showPw ? eyeOn : eyeOff} alt="" />
                          </button>
                        </div>

                        {form.showError("password") && (
                          <p className={styles.error}>{form.errors.password}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* === 비밀번호 확인 === */}
                  <div className={styles.row}>
                    <label className={styles.label}>비밀번호 확인</label>

                    <div className={styles.fieldOnly}>
                      <div className={styles.inputWrap}>
                        <div className={styles.inputInner}>
                          <input
                            className={`${styles.input} ${form.showError("passwordConfirm")
                                ? styles.inputError
                                : ""
                              }`}
                            type={showPwConfirm ? "text" : "password"}
                            value={form.formData.passwordConfirm}
                            placeholder="비밀번호 확인"
                            onChange={(e) => {
                              const v = e.target.value;
                              form.setFormData((prev) => ({
                                ...prev,
                                passwordConfirm: v,
                              }));
                              form.setTouched((t) => ({
                                ...t,
                                passwordConfirm: true,
                              }));

                              form.setErrors((prev) => ({
                                ...prev,
                                passwordConfirm:
                                  !form.formData.password.trim() && v.trim()
                                    ? "비밀번호를 먼저 입력해주세요."
                                    : form.formData.password.trim() &&
                                      !v.trim()
                                      ? "비밀번호 확인을 입력해주세요."
                                      : form.formData.password.trim() &&
                                        v !== form.formData.password
                                        ? "비밀번호가 일치하지 않습니다."
                                        : undefined,
                              }));
                            }}
                          />

                          <button
                            type="button"
                            className={styles.eyeBtn}
                            onClick={() => setShowPwConfirm((v) => !v)}
                          >
                            <img src={showPwConfirm ? eyeOn : eyeOff} alt="" />
                          </button>
                        </div>

                        {form.showError("passwordConfirm") && (
                          <p className={styles.error}>
                            {form.errors.passwordConfirm}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* === 닉네임 === */}
                  <div className={styles.row}>
                    <label className={styles.label}>닉네임</label>

                    <div className={styles.fieldLine}>
                      <div className={styles.inputWrap}>
                        <input
                          className={`${styles.input} ${form.showError("nickname")
                              ? styles.inputError
                              : ""
                            }`}
                          value={form.formData.nickname}
                          onChange={(e) => {
                            const v = e.target.value;
                            form.setFormData((prev) => ({
                              ...prev,
                              nickname: v,
                            }));
                            form.setNicknameChecked(false);
                            form.setTouched((t) => ({
                              ...t,
                              nickname: true,
                            }));

                            form.setErrors((prev) => ({
                              ...prev,
                              nickname: !v.trim()
                                ? undefined
                                : !validation.isNicknameValid(v)
                                  ? "5글자 이내로 입력해주세요."
                                  : undefined,
                            }));
                          }}
                          onBlur={() =>
                            form.setTouched((t) => ({
                              ...t,
                              nickname: true,
                            }))
                          }
                        />
                        {form.showError("nickname") && (
                          <p className={styles.error}>{form.errors.nickname}</p>
                        )}
                      </div>

                      <button
                        type="button"
                        className={styles.dupBtn}
                        onClick={handleNicknameCheck}
                        disabled={
                          !form.nicknameDirty ||
                          !validation.isNicknameValid(form.formData.nickname)
                        }
                      >
                        중복 확인
                      </button>
                    </div>
                  </div>

                  {/* === Submit 버튼 === */}
                  <div className={styles.submitArea}>
                    <button
                      type="submit"
                      className={`${styles.submitBtn} ${!form.canSubmit
                          ? styles.submitDisabled
                          : styles.submitActive
                        }`}
                    >
                      완료
                    </button>
                  </div>
                </form>
              </Card>
            </div>

            {/* === 오른쪽 사이드 === */}
            <aside className={styles.rightCol}>
              {/* 목표 설정 */}
              <div className={styles.rightCard}>
                <Card
                  title="개인 목표 설정"
                  width={325}
                  height={312}
                  backgroundColor="#ffffff"
                  radius={20}
                >
                  <div className={styles.rightInner}>
                    {/* 목표 예산 */}
                    <div className={styles.goalBlock}>
                      <div className={styles.goalLabel}>목표 예산(월 기준)</div>
                      <div className={styles.unitLine}>
                        <div className={styles.inputWrapRight}>
                          <input
                            className={`${styles.inputRight} ${form.showError("budget")
                                ? styles.inputError
                                : ""
                              }`}
                            value={form.formData.budget}
                            onChange={(e) => {
                              const v = e.target.value;
                              form.setFormData((prev) => ({
                                ...prev,
                                budget: v,
                              }));
                              form.setTouched((t) => ({
                                ...t,
                                budget: true,
                              }));

                              form.setErrors((prev) => ({
                                ...prev,
                                budget: !v.trim()
                                  ? undefined
                                  : !validation.isBudgetValid(v)
                                    ? "숫자만 입력 가능합니다."
                                    : undefined,
                              }));
                            }}
                          />
                          {form.showError("budget") && (
                            <p className={styles.error}>{form.errors.budget}</p>
                          )}
                        </div>
                        <span className={styles.unit}>원</span>
                      </div>
                    </div>

                    {/* 목표 운동 횟수 */}
                    <div className={styles.goalBlock}>
                      <div className={styles.goalLabel}>
                        목표 운동 횟수(월 기준)
                      </div>
                      <div className={styles.unitLine}>
                        <div className={styles.inputWrapRight}>
                          <input
                            className={`${styles.inputRight} ${form.showError("exerciseGoal")
                                ? styles.inputError
                                : ""
                              }`}
                            value={form.formData.exerciseGoal}
                            onChange={(e) => {
                              const v = e.target.value;
                              form.setFormData((prev) => ({
                                ...prev,
                                exerciseGoal: v,
                              }));
                              form.setTouched((t) => ({
                                ...t,
                                exerciseGoal: true,
                              }));

                              form.setErrors((prev) => ({
                                ...prev,
                                exerciseGoal: !v.trim()
                                  ? undefined
                                  : !validation.isExerciseValid(v)
                                    ? "숫자만 입력 가능합니다."
                                    : undefined,
                              }));
                            }}
                          />
                          {form.showError("exerciseGoal") && (
                            <p className={styles.error}>
                              {form.errors.exerciseGoal}
                            </p>
                          )}
                        </div>
                        <span className={styles.unit}>회</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* 프리미엄 */}
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
      </main>
    </div>
  );
}