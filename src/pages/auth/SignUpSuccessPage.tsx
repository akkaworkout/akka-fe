import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./SignUpSuccessPage.module.css";

import SideNav from "../../components/sideNav/SideNav";
import signupSuccessImg from "../../assets/images/signup-success.png";

export default function SignUpSuccessPage() {
  const nav = useNavigate();
  const [isSidebarFolded, setIsSidebarFolded] = useState(false);

  const location = useLocation();
  const nickname = location.state?.nickname ?? "회원";

  return (
    <div className={styles.wrap}>
      <SideNav
        folded={isSidebarFolded}
        onToggle={() => setIsSidebarFolded((prev) => !prev)}
      />

      <main
        className={styles.main}
        style={{ marginLeft: isSidebarFolded ? 74 : 220 }}
      >
        <div className={styles.mainInner}>
          <section className={styles.card}>
            <h1 className={styles.title}>회원가입 완료!</h1>

            <p className={styles.subTitle}>
              akka workout에 오신 걸 환영합니다.
            </p>

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

            <button className={styles.ctaBtn} onClick={() => nav("/login")}>
              로그인 하러가기
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
