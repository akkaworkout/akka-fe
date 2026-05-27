import React, { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignUpPage.module.css";

import profileDefault from "../../assets/icons/profile-default.png";
import editAvatar from "../../assets/icons/edit-avatar.png";

import Form from "../../components/common/form/Form";

import { API_BASE } from "../../api/api";

type FieldErrors = Partial<{
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  budget: string;
  exerciseGoal: string;
  profile: string;
}>;

type RegisterResponse = {
  message?: string;
  success?: boolean;
};

type CheckDuplicateResponse = {
  success?: boolean;
  available: boolean;
  message?: string;
};

export default function SignUpPage() {
  const nav = useNavigate();

  /* ================= 상태 ================= */

  // profile
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);

  // form values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [budget, setBudget] = useState("");
  const [exerciseGoal, setExerciseGoal] = useState("");

  // errors
  const [errors, setErrors] = useState<FieldErrors>({});

  // duplicate check
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);

  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState(false);

  /* ================= 유틸 ================= */

  const isEmailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const hasSpecialChar = (v: string) => /[^A-Za-z0-9]/.test(v);
  const isPasswordValid = (v: string) => v.length >= 8 && hasSpecialChar(v);
  const isNicknameValid = (v: string) => v.trim().length >= 2;

  const getErrors = () => {
    const next: FieldErrors = {};

    if (!email.trim()) next.email = "이메일을 입력해주세요.";
    else if (!isEmailValid(email))
      next.email = "올바른 이메일 형식이 아닙니다.";

    if (!password) next.password = "비밀번호를 입력해주세요.";
    else if (!isPasswordValid(password))
      next.password = "비밀번호는 특수문자 포함 8자 이상이어야 합니다.";

    if (!passwordConfirm)
      next.passwordConfirm = "비밀번호 확인을 입력해주세요.";
    else if (passwordConfirm !== password)
      next.passwordConfirm = "비밀번호가 일치하지 않습니다.";

    if (!nickname.trim()) next.nickname = "닉네임을 입력해주세요.";
    else if (!isNicknameValid(nickname))
      next.nickname = "닉네임은 2자 이상이어야 합니다.";

    if (budget && !/^\d+$/.test(budget))
      next.budget = "숫자만 입력 가능합니다.";
    if (exerciseGoal && !/^\d+$/.test(exerciseGoal))
      next.exerciseGoal = "숫자만 입력 가능합니다.";

    // 프로필을 필수로 하고 싶으면 주석 해제
    // if (!profileFile) next.profile = '프로필 이미지를 선택해주세요.'

    return next;
  };

  const validate = () => {
    const next = getErrors();
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleCheckEmail = async () => {
    if (!isEmailValid(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "올바른 이메일 형식이 아닙니다.",
      }));
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/auth/check-email?email=${encodeURIComponent(email)}`,
      );

      const data = (await res.json()) as CheckDuplicateResponse;

      if (!res.ok) {
        throw new Error(data?.message || "이메일 중복확인 실패");
      }

      setEmailChecked(true);
      setEmailAvailable(data.available);

      setErrors((prev) => ({
        ...prev,
        email: data.available ? undefined : "이미 사용 중인 이메일입니다.",
      }));

      if (data.available) {
        alert("사용 가능한 이메일입니다.");
      }
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        email: "이메일 중복확인 중 오류가 발생했습니다.",
      }));
    }
  };

  const handleCheckNickname = async () => {
    const v = nickname.trim();

    if (v.length === 0) {
      setErrors((prev) => ({
        ...prev,
        nickname: "닉네임을 입력해주세요.",
      }));
      return;
    }

    if (v.length > 5) {
      setErrors((prev) => ({
        ...prev,
        nickname: "5글자 이내로 입력해주세요.",
      }));
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/auth/check-nickname?nickname=${encodeURIComponent(v)}`,
      );

      const data = (await res.json()) as CheckDuplicateResponse;

      if (!res.ok) {
        throw new Error(data?.message || "닉네임 중복확인 실패");
      }

      setNicknameChecked(true);
      setNicknameAvailable(data.available);

      setErrors((prev) => ({
        ...prev,
        nickname: data.available ? undefined : "이미 사용 중인 닉네임입니다.",
      }));

      if (data.available) {
        alert("사용 가능한 닉네임입니다.");
      }
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        nickname: "닉네임 중복확인 중 오류가 발생했습니다.",
      }));
    }
  };

  /* ================= 이벤트 ================= */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    if (!emailChecked || !emailAvailable) {
      setErrors((prev) => ({
        ...prev,
        email: "이메일 중복확인을 해주세요.",
      }));
      return;
    }

    if (!nicknameChecked || !nicknameAvailable) {
      setErrors((prev) => ({
        ...prev,
        nickname: "닉네임 중복확인을 해주세요.",
      }));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("nickname", nickname);
      formData.append("target_budget", String(Number(budget)));
      formData.append("target_exercise_count", String(Number(exerciseGoal)));

      // 파일 키는 반드시 "profile"
      if (profileFile) formData.append("profile", profileFile);

      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        body: formData,
      });

      // 400 원인 확인용
      const raw = await res.text();
      console.log("STATUS:", res.status);
      console.log("RAW:", raw);

      let data: RegisterResponse | null = null;

      try {
        data = JSON.parse(raw) as RegisterResponse;
      } catch {
        data = null;
      }

      if (!res.ok) {
        alert(data?.message ?? raw ?? "회원가입 실패");
        return;
      }

      alert("회원가입 성공!");
      nav("/signup/success", {
        state: { nickname },
      });
    } catch (err) {
      console.error(err);
      alert("서버 연결 실패");
    }
  };

  const handlePickProfile = () => {
    fileRef.current?.click();
  };

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        profile: "이미지 파일만 업로드할. 수 있습니다.",
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
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const canSubmit =
    isEmailValid(email) &&
    emailChecked &&
    emailAvailable &&
    isPasswordValid(password) &&
    password === passwordConfirm &&
    isNicknameValid(nickname) &&
    nicknameChecked &&
    nicknameAvailable &&
    budget.trim() !== "" &&
    /^\d+$/.test(budget) &&
    exerciseGoal.trim() !== "" &&
    /^\d+$/.test(exerciseGoal);

  /* ================= 렌더 ================= */

  return (
    <div className={styles.wrap}>
      <main className={styles.main}>
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
                  src={profilePreview ?? profileDefault}
                  alt="프로필"
                  draggable={false}
                />
                <button
                  type="button"
                  className={styles.editAvatarBtn}
                  onClick={handlePickProfile}
                  aria-label="프로필 사진 수정"
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

              {/* 필요하면 프로필 에러 표시 */}
              {/* {errors.profile && <p className={styles.errorText}>{errors.profile}</p>} */}
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <Form
                label="이메일"
                value={email}
                onChange={(e) => {
                  const v = e.target.value;
                  setEmail(v);

                  setEmailChecked(false);
                  setEmailAvailable(false);

                  setErrors((prev) => ({
                    ...prev,
                    email:
                      v && !isEmailValid(v)
                        ? "올바른 이메일 형식이 아닙니다"
                        : undefined,
                  }));
                }}
                placeholder="akka@naver.com"
                autoComplete="email"
                errorText={errors.email}
                rightButton={{
                  label: "중복 확인",
                  onClick: handleCheckEmail,
                  disabled:
                    !isEmailValid(email) || (emailChecked && emailAvailable),
                }}
              />

              <Form
                label="비밀번호"
                type="password"
                value={password}
                onChange={(e) => {
                  const v = e.target.value;
                  setPassword(v);

                  setErrors((prev) => {
                    const next: FieldErrors = { ...prev };

                    if (!v) next.password = "비밀번호를 입력해주세요.";
                    else if (!isPasswordValid(v))
                      next.password =
                        "비밀번호는 특수문자 포함 8자 이상이어야 합니다.";
                    else next.password = undefined;

                    if (passwordConfirm) {
                      next.passwordConfirm =
                        passwordConfirm !== v
                          ? "비밀번호가 일치하지 않습니다."
                          : undefined;
                    }

                    return next;
                  });
                }}
                placeholder="비밀번호 (특수문자 포함, 8자 이상)"
                autoComplete="new-password"
                showPasswordToggle
                errorText={errors.password}
              />

              <Form
                label="비밀번호 확인"
                value={passwordConfirm}
                onChange={(e) => {
                  const v = e.target.value;
                  setPasswordConfirm(v);
                  setErrors((prev) => ({
                    ...prev,
                    passwordConfirm:
                      v && v !== password
                        ? "비밀번호가 일치하지 않습니다"
                        : undefined,
                  }));
                }}
                placeholder="비밀번호 (특수문자 포함, 8자 이상)"
                type="password"
                showPasswordToggle
                errorText={errors.passwordConfirm}
              />

              <Form
                label="닉네임"
                value={nickname}
                onChange={(e) => {
                  const v = e.target.value;
                  setNickname(v);

                  setNicknameChecked(false);
                  setNicknameAvailable(false);

                  setErrors((prev) => ({ ...prev, nickname: undefined }));
                }}
                placeholder="5글자 이내로 입력해주세요"
                errorText={errors.nickname}
                rightButton={{
                  label: "중복 확인",
                  onClick: handleCheckNickname,
                  disabled:
                    nickname.trim().length === 0 ||
                    (nicknameChecked && nicknameAvailable),
                }}
              />

              <Form
                label="목표 예산(월 기준)"
                value={budget}
                onChange={(e) => {
                  const v = e.target.value;
                  setBudget(v);
                  setErrors((prev) => ({
                    ...prev,
                    budget:
                      v && !/^\d+$/.test(v)
                        ? "숫자만 입력 가능합니다"
                        : undefined,
                  }));
                }}
                inputMode="numeric"
                placeholder="120000"
                errorText={errors.budget}
              />

              <Form
                label="목표 운동 횟수(월 기준)"
                value={exerciseGoal}
                onChange={(e) => {
                  const v = e.target.value;
                  setExerciseGoal(v);
                  setErrors((prev) => ({
                    ...prev,
                    exerciseGoal:
                      v && !/^\d+$/.test(v)
                        ? "숫자만 입력 가능합니다"
                        : undefined,
                  }));
                }}
                inputMode="numeric"
                placeholder="12"
                errorText={errors.exerciseGoal}
              />

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
                    회원가입
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
