import { useState } from 'react'
import styles from './Main.module.css'
import SideNav from '../../components/sideNav/SideNav'

const Main = () => {
  const [isSidebarFolded, setIsSidebarFolded] = useState(false)

  return (
    <div className={styles.wrap}>
      <SideNav
        folded={isSidebarFolded}
        onToggle={() => setIsSidebarFolded(prev => !prev)}
      />

      <main
        className={styles.main}
        style={{
          marginLeft: isSidebarFolded ? 74 : 220,
        }}
      >
        <div className={styles.mainInner}>
          메인 내용
        </div>
      </main>
    </div>
  )
}

export default Main