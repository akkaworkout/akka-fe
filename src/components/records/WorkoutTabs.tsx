import { useNavigate, useLocation } from 'react-router-dom'
import styles from './WorkoutTabs.module.css'

const TABS = [
  { label: '운동 기록', path: '/write' },
  { label: '기타 지출', path: '/expense' },
  { label: '이용권 관리', path: '/ticket' },
]

const WorkoutTabs = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className={styles.tabContainer}>
      {TABS.map(tab => {
        const isActive = location.pathname === tab.path

        return (
          <button
            key={tab.label}
            className={`${styles.tab} ${
              isActive ? styles.active : ''
            }`}
            onClick={() => navigate(tab.path)}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

export default WorkoutTabs