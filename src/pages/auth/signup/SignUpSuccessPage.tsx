import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import styles from './SignUpSuccessPage.module.css'
import signupSuccessImg from '@/assets/images/money-bag.png'

export default function SignUpSuccessPage() {
  const location = useLocation()
  const nickname = location.state?.nickname ?? '회원'

  return (
    <>
      <Helmet>
        <title>가입 완료 | Akkaworkout</title>
        <meta
          name="description"
          content="회원가입이 완료되었습니다. 지금 로그인하고 운동 기록, 지출 관리, 이용권 관리를 시작해 보세요."
        />
      </Helmet>
      <div className={styles.wrap}>
        <div className={styles.main}>
          <div className={styles.mainInner}>
            <section className={styles.card}>
              <h1 className={styles.title}>회원가입 완료!</h1>
              <p className={styles.subTitle}>akka workout에 오신 걸 환영합니다.</p>
              <img
                src={signupSuccessImg}
                alt="회원가입 완료"
                className={styles.image}
                draggable={false}
              />
              <p className={styles.desc}>
                {nickname}님의 회원가입이
                <br />
                성공적으로 완료되었습니다.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
