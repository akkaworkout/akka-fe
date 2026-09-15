import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'

import styles from './MainPage.module.css'

import mainAkka from '@/assets/brand/main-akka.png'
import mainWorkout from '@/assets/brand/main-workout.png'
import akkaMascot from '@/assets/brand/akka-mascot.png'

export default function MainPage() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
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
              <div className={styles.copy}>
                <p className={styles.kicker}>
                  {isLoggedIn ? '오늘의 운동, 여기서 시작해요' : '운동 안 가면, 돈도 사라집니다'}
                </p>

                <h1 className={styles.title}>
                  {isLoggedIn ? '내 운동 루틴을 이어가요' : '이제 숫자로 확인하세요'}
                </h1>

                {!isLoggedIn && (
                  <div className={styles.brand}>
                    <img
                      className={styles.brandAkka}
                      src={mainAkka}
                      alt="akka"
                      width={2692}
                      height={980}
                    />
                    <img
                      className={styles.brandWorkout}
                      src={mainWorkout}
                      alt="workout"
                      width={3460}
                      height={842}
                    />
                  </div>
                )}
                {isLoggedIn ? (
                  <div className={styles.quickLinks}>
                    <Link className={styles.quickLink} to="/write">
                      <strong>운동 기록하기</strong>
                      <span>오늘의 운동을 남겨요 →</span>
                    </Link>
                    <Link className={styles.quickLink} to="/ticket">
                      <strong>이용권 확인하기</strong>
                      <span>남은 횟수와 기간을 확인해요 →</span>
                    </Link>
                    <Link className={styles.quickLink} to="/report">
                      <strong>내 기록 돌아보기</strong>
                      <span>운동과 지출을 한눈에 봐요 →</span>
                    </Link>
                  </div>
                ) : (
                  <div className={styles.actions}>
                    <Link className={styles.loginButton} to="/login">
                      로그인하고 시작하기
                    </Link>
                    <Link className={styles.signupLink} to="/signup">
                      처음이신가요? 회원가입
                    </Link>
                  </div>
                )}
              </div>

              <div className={styles.illustWrap}>
                <img
                  className={styles.illust}
                  src={akkaMascot}
                  alt="덤벨을 든 Akkaworkout 마스코트"
                  width={640}
                  height={687}
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
