import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import styles from "./MyPage.module.css";

import SideNav from "../../components/sideNav/SideNav";
import Card from "../../components/common/Card";

import profileDefault from "../../assets/icons/profile-default.png";
import editAvatar from "../../assets/icons/edit-avatar.png";
import eyeOn from "../../assets/icons/icon-eye-on.png";
import eyeOff from "../../assets/icons/icon-eye-off.png";
import premiumCard from "../../assets/images/premium-card.png";

import { apiFetch } from "../../api/api";
import { flushSync } from "react-dom"; 

type FieldErrors = Partial<{
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  budget: string;
  exerciseGoal: string;
  profile: string;
}>;

type Touched = Partial<Record<keyof FieldErrors, boolean>>;

type User = {
  id?: number;
  email?: string;
  nickname?: string;
  profile_image_url?: string;
  target_budget?: number;
  target_exercise_count?: number;
  points?: number;
};

const isEmailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const hasSpecialChar = (v: string) => /[^A-Za-z0-9]/.test(v);
const isPasswordValid = (v: string) => v.length >= 8 && hasSpecialChar(v);

export default function MyPage() {
  const [initial, setInitial] = useState({
    email: "",
    nickname: "",
    budget: "",
    exerciseGoal: "",
    premiumPoint: "",
  });

  const [isSidebarFolded, setIsSidebarFolded] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [budget, setBudget] = useState("");
  const [exerciseGoal, setExerciseGoal] = useState("");

  const [user, setUser] = useState<User | null>(null);

  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);

  const [emailChecked, setEmailChecked] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [submitted, setSubmitted] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL;

  const showError = (k: keyof FieldErrors) =>
    (submitted || touched[k]) && Boolean(errors[k]);

  /* ================= 조회: fetchMe ================= */
  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const json = await apiFetch("/users/me", { method: "GET" });
      const me = json?.data ?? {};

      const nextEmail = me.email ?? "";
      const nextNickname = me.nickname ?? "";
      const nextBudget =
        me.target_budget === null || me.target_budget === undefined
          ? ""
          : String(me.target_budget);
      const nextExercise =
        me.target_exercise_count === null ||
        me.target_exercise_count === undefined
          ? ""
          : String(me.target_exercise_count);

      // ✅ flushSync로 감싸기
      flushSync(() => {
        setUser(me);
        setInitial({
          email: nextEmail,
          nickname: nextNickname,
          budget: nextBudget,
          exerciseGoal: nextExercise,
          premiumPoint: me.premium_point ? `${me.premium_point}P` : "0P",
        });
        setEmail(nextEmail);
        setNickname(nextNickname);
        setBudget(nextBudget);
        setExerciseGoal(nextExercise);
        setPassword("");
        setPasswordConfirm("");
      });
    } catch (err) {
      console.error("내 정보 조회 실패", err);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, []); // ← 빈 배열 유지

  /* ================= 더티/검사 규칙 ================= */
  const emailDirty = email !== initial.email;
  const nicknameDirty = nickname !== initial.nickname;
  const budgetDirty = budget !== initial.budget;
  const exerciseDirty = exerciseGoal !== initial.exerciseGoal;
  const passwordDirty =
    password.trim().length > 0 || passwordConfirm.trim().length > 0;

  const emailOk = !emailDirty || isEmailValid(email);
  const nicknameOk = !nicknameDirty || nickname.trim().length <= 5;
  const budgetOk = !budgetDirty || /^\d+$/.test(budget);
  const exerciseOk = !exerciseDirty || /^\d+$/.test(exerciseGoal);

  const passwordOk =
    !passwordDirty ||
    (isPasswordValid(password) && passwordConfirm === password);

  const emailCheckOk = !emailDirty || emailChecked;
  const nicknameCheckOk = !nicknameDirty || nicknameChecked;

  const hasAnyChange =
    emailDirty ||
    nicknameDirty ||
    budgetDirty ||
    exerciseDirty ||
    passwordDirty;

  const canSubmit = useMemo(() => {
    return (
      hasAnyChange &&
      emailOk &&
      nicknameOk &&
      budgetOk &&
      exerciseOk &&
      passwordOk &&
      emailCheckOk &&
      nicknameCheckOk
    );
  }, [
    hasAnyChange,
    emailOk,
    nicknameOk,
    budgetOk,
    exerciseOk,
    passwordOk,
    emailCheckOk,
    nicknameCheckOk,
  ]);

  /* ================= validate: 입력한 것만 검사 ================= */
  const validate = () => {
    const next: FieldErrors = {};

    if (emailDirty) {
      if (!isEmailValid(email)) next.email = "올바른 이메일 형식이 아닙니다.";
      else if (!emailChecked) next.email = "이메일 중복 확인을 해주세요.";
    }

    if (nicknameDirty) {
      if (nickname.trim().length > 5)
        next.nickname = "5글자 이내로 입력해주세요.";
      else if (!nicknameChecked) next.nickname = "닉네임 중복 확인을 해주세요.";
    }

    if (budgetDirty) {
      if (!/^\d+$/.test(budget)) next.budget = "숫자만 입력 가능합니다.";
    }

    if (exerciseDirty) {
      if (!/^\d+$/.test(exerciseGoal))
        next.exerciseGoal = "숫자만 입력 가능합니다.";
    }

    if (passwordDirty) {
      if (!password.trim()) next.password = "비밀번호를 입력해주세요.";
      else if (!isPasswordValid(password))
        next.password = "비밀번호는 특수문자 포함 8자 이상이어야 합니다.";

      if (!passwordConfirm.trim())
        next.passwordConfirm = "비밀번호 확인을 입력해주세요.";
      else if (passwordConfirm !== password)
        next.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  /* ================= PATCH ================= */
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!canSubmit) {
      validate();
      return;
    }

    if (!validate()) return;

    const payload: Record<string, string | number> = {};
    if (emailDirty) payload.email = email.trim();
    if (nicknameDirty) payload.nickname = nickname.trim();
    if (budgetDirty) payload.target_budget = Number(budget);
    if (exerciseDirty) payload.target_exercise_count = Number(exerciseGoal);
    if (password.trim()) payload.password = password;

    if (Object.keys(payload).length === 0) {
      alert("수정할 값이 없습니다.");
      return;
    }

    try {
      // 파일 가져오기
      const file = fileRef.current?.files?.[0];

      await updateMe(payload, file);
      alert("수정 완료");
      setEmail("");
      setNickname("");
      setBudget("");
      setExerciseGoal("");
      setPassword("");
      setPasswordConfirm("");
      setEmailChecked(false);
      setNicknameChecked(false);
      setErrors({});
      setTouched({});
      setSubmitted(false);
      setProfilePreview(null);
      await fetchMe();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "수정 실패";
      alert(errorMsg);
    }
  };

  /* ================= 중복확인(현재는 stub) ================= */
  const handleEmailCheck = () => {
    if (!emailDirty || !isEmailValid(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "올바른 이메일 형식이 아닙니다.",
      }));
      setTouched((t) => ({ ...t, email: true }));
      return;
    }

    alert("이메일 중복 확인");
    setEmailChecked(true);
  };

  const handleNicknameCheck = () => {
    if (!nicknameDirty) {
      setErrors((prev) => ({ ...prev, nickname: "닉네임을 입력해주세요." }));
      setTouched((t) => ({ ...t, nickname: true }));
      return;
    }

    if (nickname.trim().length > 5) {
      setErrors((prev) => ({
        ...prev,
        nickname: "5글자 이내로 입력해주세요.",
      }));
      setTouched((t) => ({ ...t, nickname: true }));
      return;
    }

    alert("닉네임 중복 확인");
    setNicknameChecked(true);
  };

  const handlePickProfile = () => fileRef.current?.click();

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        profile: "이미지 파일만 업로드할 수 있습니다.",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        profile: "이미지 용량은 5MB 이하만 가능합니다.",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, profile: undefined }));
    setProfilePreview(URL.createObjectURL(file));
  };

  return (
    <div className={styles.wrap}>
      <SideNav
        folded={isSidebarFolded}
        onToggle={() => setIsSidebarFolded((p) => !p)}
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
                  <div className={styles.row}>
                    <label className={styles.label}>이메일</label>

                    <div className={styles.fieldLine}>
                      <div className={styles.inputWrap}>
                        <input
                          className={`${styles.input} ${showError("email") ? styles.inputError : ""}`}
                          value={email}
                          onChange={(e) => {
                            const v = e.target.value;
                            setEmail(v);
                            setEmailChecked(false);
                            setTouched((t) => ({ ...t, email: true }));

                            setErrors((prev) => ({
                              ...prev,
                              email: !v.trim()
                                ? undefined
                                : !isEmailValid(v)
                                  ? "올바른 이메일 형식이 아닙니다."
                                  : undefined,
                            }));
                          }}
                          onBlur={() =>
                            setTouched((t) => ({ ...t, email: true }))
                          }
                          autoComplete="off"
                        />
                        {showError("email") && (
                          <p className={styles.error}>{errors.email}</p>
                        )}
                      </div>

                      <button
                        type="button"
                        className={styles.dupBtn}
                        onClick={handleEmailCheck}
                        disabled={!emailDirty || !isEmailValid(email)}
                      >
                        중복 확인
                      </button>
                    </div>
                  </div>

                  <div className={styles.row}>
                    <label className={styles.label}>비밀번호</label>

                    <div className={styles.fieldOnly}>
                      <div className={styles.inputWrap}>
                        <div className={styles.inputInner}>
                          <input
                            className={`${styles.input} ${showError("password") ? styles.inputError : ""}`}
                            type={showPw ? "text" : "password"}
                            value={password}
                            placeholder="비밀번호 (특수문자 포함, 8자 이상)"
                            onChange={(e) => {
                              const v = e.target.value;
                              setPassword(v);
                              setTouched((t) => ({ ...t, password: true }));

                              setErrors((prev) => ({
                                ...prev,
                                password: !v.trim()
                                  ? undefined
                                  : !isPasswordValid(v)
                                    ? "비밀번호는 특수문자 포함 8자 이상이어야 합니다."
                                    : undefined,
                                passwordConfirm:
                                  passwordConfirm.trim() &&
                                  v !== passwordConfirm
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

                        {showError("password") && (
                          <p className={styles.error}>{errors.password}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.row}>
                    <label className={styles.label}>비밀번호 확인</label>

                    <div className={styles.fieldOnly}>
                      <div className={styles.inputWrap}>
                        <div className={styles.inputInner}>
                          <input
                            className={`${styles.input} ${
                              showError("passwordConfirm")
                                ? styles.inputError
                                : ""
                            }`}
                            type={showPwConfirm ? "text" : "password"}
                            value={passwordConfirm}
                            placeholder="비밀번호 확인"
                            onChange={(e) => {
                              const v = e.target.value;
                              setPasswordConfirm(v);
                              setTouched((t) => ({
                                ...t,
                                passwordConfirm: true,
                              }));

                              setErrors((prev) => ({
                                ...prev,
                                passwordConfirm:
                                  !password.trim() && v.trim()
                                    ? "비밀번호를 먼저 입력해주세요."
                                    : password.trim() && !v.trim()
                                      ? "비밀번호 확인을 입력해주세요."
                                      : password.trim() && v !== password
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

                        {showError("passwordConfirm") && (
                          <p className={styles.error}>
                            {errors.passwordConfirm}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.row}>
                    <label className={styles.label}>닉네임</label>

                    <div className={styles.fieldLine}>
                      <div className={styles.inputWrap}>
                        <input
                          className={`${styles.input} ${showError("nickname") ? styles.inputError : ""}`}
                          value={nickname}
                          onChange={(e) => {
                            const v = e.target.value;
                            setNickname(v);
                            setNicknameChecked(false);
                            setTouched((t) => ({ ...t, nickname: true }));

                            setErrors((prev) => ({
                              ...prev,
                              nickname: !v.trim()
                                ? undefined
                                : v.trim().length > 5
                                  ? "5글자 이내로 입력해주세요."
                                  : undefined,
                            }));
                          }}
                          onBlur={() =>
                            setTouched((t) => ({ ...t, nickname: true }))
                          }
                        />
                        {showError("nickname") && (
                          <p className={styles.error}>{errors.nickname}</p>
                        )}
                      </div>

                      <button
                        type="button"
                        className={styles.dupBtn}
                        onClick={handleNicknameCheck}
                        disabled={!nicknameDirty || nickname.trim().length > 5}
                      >
                        중복 확인
                      </button>
                    </div>
                  </div>

                  <div className={styles.submitArea}>
                    <button
                      type="submit"
                      className={`${styles.submitBtn} ${
                        !canSubmit ? styles.submitDisabled : styles.submitActive
                      }`}
                    >
                      완료
                    </button>
                  </div>
                </form>
              </Card>
            </div>

            <aside className={styles.rightCol}>
              <div className={styles.rightCard}>
                <Card
                  title="개인 목표 설정"
                  width={325}
                  height={312}
                  backgroundColor="#ffffff"
                  radius={20}
                >
                  <div className={styles.rightInner}>
                    <div className={styles.goalBlock}>
                      <div className={styles.goalLabel}>목표 예산(월 기준)</div>
                      <div className={styles.unitLine}>
                        <div className={styles.inputWrapRight}>
                          <input
                            className={`${styles.inputRight} ${showError("budget") ? styles.inputError : ""}`}
                            value={budget}
                            onChange={(e) => {
                              const v = e.target.value;
                              setBudget(v);
                              setTouched((t) => ({ ...t, budget: true }));

                              setErrors((prev) => ({
                                ...prev,
                                budget: !v.trim()
                                  ? undefined
                                  : !/^\d+$/.test(v)
                                    ? "숫자만 입력 가능합니다."
                                    : undefined,
                              }));
                            }}
                          />
                          {showError("budget") && (
                            <p className={styles.error}>{errors.budget}</p>
                          )}
                        </div>
                        <span className={styles.unit}>원</span>
                      </div>
                    </div>

                    <div className={styles.goalBlock}>
                      <div className={styles.goalLabel}>
                        목표 운동 횟수(월 기준)
                      </div>
                      <div className={styles.unitLine}>
                        <div className={styles.inputWrapRight}>
                          <input
                            className={`${styles.inputRight} ${showError("exerciseGoal") ? styles.inputError : ""}`}
                            value={exerciseGoal}
                            onChange={(e) => {
                              const v = e.target.value;
                              setExerciseGoal(v);
                              setTouched((t) => ({ ...t, exerciseGoal: true }));

                              setErrors((prev) => ({
                                ...prev,
                                exerciseGoal: !v.trim()
                                  ? undefined
                                  : !/^\d+$/.test(v)
                                    ? "숫자만 입력 가능합니다."
                                    : undefined,
                              }));
                            }}
                          />
                          {showError("exerciseGoal") && (
                            <p className={styles.error}>
                              {errors.exerciseGoal}
                            </p>
                          )}
                        </div>
                        <span className={styles.unit}>회</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

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
                      {initial.premiumPoint}
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
