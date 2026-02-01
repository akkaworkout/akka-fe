import { useState } from 'react'
import styles from './LoginPage.module.css'
import SideNav from '../../components/sideNav/SideNav'

const LoginPage = () => {
  const [isSidebarFolded, setIsSidebarFolded] = useState(false)

  return (
    <div className={styles.wrap}>
      <SideNav
        folded={isSidebarFolded}
        onToggle={() => setIsSidebarFolded(prev => !prev)}
      />

      <main
        className={styles.login}
        style={{
          marginLeft: isSidebarFolded ? 74 : 220,
        }}
      >
        <div className={styles.loginInner}>
          로그인 내용
        </div>
      </main>
    </div>
  )
}

export default LoginPage