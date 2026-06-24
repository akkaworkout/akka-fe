import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async'

import { useAuthStore } from "@/stores/useAuthStore";

import styles from './MainPage.module.css'

import mainAkka from "@/assets/brand/main-akka.png";
import mainWorkout from "@/assets/brand/main-workout.png";
import mainpage from "@/assets/brand/main-hero.webp";


export default function MainPage() {
  const navigate = useNavigate();

  const { isLoggedIn } = useAuthStore();

  return (
    <>
      <Helmet>
        <title>Akkaworkout | 운동 노쇼 방지 기록 서비스</title>
        <meta
          name="description"
          content="Akkaworkout은 운동 기록, 지출, 이용권, 노쇼 손실을 한눈에 관리하는 운동 루틴 기록 서비스입니다."
        />
        <meta property="og:title" content="Akkaworkout | 운동 노쇼 방지 기록 서비스" />
        <meta
          property="og:description"
          content="운동 기록과 지출, 이용권, 노쇼 손실을 Akkaworkout에서 한눈에 관리해 보세요."
        />
      </Helmet>

      <div className={styles.wrap}>
        <div className={styles.mainPage}>
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
                  alt="Akkaworkout 메인 일러스트"
                  decoding="async"
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}