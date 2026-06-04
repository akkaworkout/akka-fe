import { useNavigate } from "react-router-dom";

import { useAuthStore } from "@/stores/useAuthStore";

import styles from './MainPage.module.css'

import mainAkka from "@/assets/images/mainakka.png";
import mainWorkout from "@/assets/images/mainworkout.png";
import mainpage from "@/assets/images/mainpage.png";

import "@/chartDefaults";

export default function MainPage() {
  const navigate = useNavigate();

  const { isLoggedIn } = useAuthStore();

  return (
    <div className={styles.wrap}>
      <main className={styles.mainPage}>
        <div className={styles.mainInner}>
          <section className={styles.hero}>
            {/* 왼쪽 텍스트 */}
            <div className={styles.copy}>
              <p className={styles.kicker}>
                운동 안 가면, 돈도 사라집니다
              </p>

              <h1 className={styles.title}>
                이제 숫자로 확인하세요
              </h1>

              <div className={styles.brand}>
                <img
                  className={styles.brandAkka}
                  src={mainAkka}
                  alt="akka"
                />

                <img
                  className={styles.brandWorkout}
                  src={mainWorkout}
                  alt="workout"
                />
              </div>

              {!isLoggedIn && (
                <button
                  className={styles.loginButton}
                  onClick={() => navigate("/login")}
                >
                  로그인 시작하기
                </button>
              )}
            </div>

            {/* 오른쪽 일러스트 */}
            <div className={styles.illustWrap}>
              <img
                className={styles.illust}
                src={mainpage}
                alt="메인 일러스트"
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}