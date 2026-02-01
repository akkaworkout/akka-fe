import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import styles from './SideNav.module.css'
import akkaLogo from '../../assets/images/akka_logo.png'
import akkaLogoSvg from '../../assets/images/akka_logo_svg.png'
import akkaLogout from '../../assets/icons/akka_logout.png'

import sidebarToggleIcon from '../../assets/icons/sidebar/sidebar_toggle.png'

import sidebarMenuIcon from '../../assets/icons/sidebar/sidebar_menu.png'
import sidebarMenuActiveIcon from '../../assets/icons/sidebar/sidebar_menu_active.png'

import sidebarWriteIcon from '../../assets/icons/sidebar/sidebar_write.png'
import sidebarWriteActiveIcon from '../../assets/icons/sidebar/sidebar_write_active.png'

import sidebarReportIcon from '../../assets/icons/sidebar/sidebar_report.png'
import sidebarReportActiveIcon from '../../assets/icons/sidebar/sidebar_report_active.png'

import sidebarCalendarIcon from '../../assets/icons/sidebar/sidebar_calendar.png'
import sidebarCalendarActiveIcon from '../../assets/icons/sidebar/sidebar_calendar_active.png'

import sidebarSettingIcon from '../../assets/icons/sidebar/sidebar_setting.png'
import sidebarSettingActiveIcon from '../../assets/icons/sidebar/sidebar_setting_active.png'

import example from '../../assets/images/example.png'

type SideNavProps = {
  folded: boolean
  onToggle: () => void
}

const SideNav = ({ folded, onToggle }: SideNavProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSidebarFolded, setIsSidebarFolded] = useState(false)

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setIsSidebarFolded(true)
      } else {
        setIsSidebarFolded(false)
      }
    }

    handleResize() // 최초 진입 시
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <aside
      className={`${styles.sideNav} ${folded ? styles.sideNavFolded : ''}`}
    >
      {/* 토글 버튼 */}
      <div className={styles.sidebarToggleWrapper} onClick={onToggle}>
        <img
          src={sidebarToggleIcon}
          className={styles.sidebarToggleIcon}
          alt="sidebar toggle"
        />
      </div>

      {/* 로고 */}
      {!folded ? (
        <img src={akkaLogo} className={styles.sideNavLogo} alt="akka logo" />
      ) : (
        <img
          src={akkaLogoSvg}
          className={styles.sideNavLogoSvg}
          alt="akka logo"
        />
      )}

      {/* 메뉴 */}
      <div className={styles.sidebarMenuWrapper}>
        <div
          className={`${styles.sidebarMenu} ${isActive('/main') ? styles.active : ''}`}
          onClick={() => handleNavigate('/main')}
        >
          <img
            src={isActive('/main') ? sidebarMenuActiveIcon : sidebarMenuIcon}
            className={styles.sidebarMenuIcon}
          />
          {!folded && '메인'}
        </div>

        <div
          className={`${styles.sidebarMenu} ${isActive('/write') ? styles.active : ''}`}
          onClick={() => handleNavigate('/write')}
        >
          <img
            src={isActive('/write') ? sidebarWriteActiveIcon : sidebarWriteIcon}
            className={styles.sidebarMenuIcon}
          />
          {!folded && '운동 기록'}
        </div>

        <div
          className={`${styles.sidebarMenu} ${isActive('/report') ? styles.active : ''}`}
          onClick={() => handleNavigate('/report')}
        >
          <img
            src={isActive('/report') ? sidebarReportActiveIcon : sidebarReportIcon}
            className={styles.sidebarMenuIcon}
          />
          {!folded && '분석/리포트'}
        </div>

        <div
          className={`${styles.sidebarMenu} ${isActive('/calendar') ? styles.active : ''}`}
          onClick={() => handleNavigate('/calendar')}
        >
          <img
            src={isActive('/calendar') ? sidebarCalendarActiveIcon : sidebarCalendarIcon}
            className={styles.sidebarMenuIcon}
          />
          {!folded && '캘린더'}
        </div>

        <div
          className={`${styles.sidebarMenu} ${isActive('/mypage') ? styles.active : ''}`}
          onClick={() => handleNavigate('/mypage')}
        >
          <img
            src={isActive('/mypage') ? sidebarSettingActiveIcon : sidebarSettingIcon}
            className={styles.sidebarMenuIcon}
          />
          {!folded && '마이페이지'}
        </div>
      </div>

      {/* 프로필 */}
      <div className={styles.sidebarProfileWrapper}>
        <div
          className={styles.sidebarProfile}
          onClick={() => handleNavigate('/login')}
        >
          <img src={example} className={styles.sidebarProfileImg} />
        </div>

        {!folded && <div className={styles.sidebarUser}>Minju Lee</div>}
        {!folded && (
          <img
            src={akkaLogout}
            className={styles.sidebarLogout}
            onClick={() => handleNavigate('/')}
          />
        )}
      </div>
    </aside>
  )
}

export default SideNav