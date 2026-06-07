import { useNavigate, useLocation } from 'react-router-dom'

import Button from '@/components/button/Button'

import styles from './RecordTabs.module.css'

const TABS = [
  { label: '운동 기록', path: '/write' },
  { label: '기타 지출', path: '/expense' },
  { label: '이용권 관리', path: '/ticket' },
]

const RecordTabs = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className={styles.tabContainer}>
      {TABS.map(tab => {
        const isActive =
          location.pathname === tab.path

        return (
          <Button
            key={tab.label}
            active={isActive}
            onClick={() => navigate(tab.path)}
          >
            {tab.label}
          </Button>
        )
      })}
    </div>
  )
}

export default RecordTabs