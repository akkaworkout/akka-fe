import { useState } from 'react'

import styles from './WorkoutHistory.module.css'
import SideNav from '../../components/sideNav/SideNav'

const WorkoutHistoryPage = () => {
  const [isSidebarFolded, setIsSidebarFolded] = useState(false)

  return (
    <>
      <div className={styles.wrap}>
        <SideNav
          folded={isSidebarFolded}
          onToggle={() => setIsSidebarFolded(prev => !prev)}
        />

        <main
          className={styles.writePage}
          style={{ marginLeft: isSidebarFolded ? 74 : 220 }}
        >
          <div className={styles.writeInner}>
            <div className={styles.title}>운동 기록</div>
          </div>
        </main>
      </div>

    </>
  )
}

export default WorkoutHistoryPage