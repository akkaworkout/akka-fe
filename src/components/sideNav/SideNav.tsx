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
  const [user, setUser] = useState<any>(null)

  const API_BASE = import.meta.env.VITE_API_URL

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  const isActive = (paths: string[]) => {
    return paths.some(path => location.pathname.startsWith(path))
  }

  /* 사이드바 반응형 */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setIsSidebarFolded(true)
      } else {
        setIsSidebarFolded(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  /* 로그인 유저 가져오기 */
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const json = await res.json()
        setUser(json.data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchUser()
  }, [API_BASE])

  /* 로그아웃 */
  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    navigate('/login')
  }

  return (
    <aside className={`${styles.sideNav} ${folded ? styles.sideNavFolded : ''}`}>
      <div className={styles.sidebarToggleWrapper} onClick={onToggle}>
        <img
          src={sidebarToggleIcon}
          className={styles.sidebarToggleIcon}
          alt="sidebar toggle"
        />
      </div>

      {!folded ? (
        <img src={akkaLogo} className={styles.sideNavLogo} alt="akka logo" />
      ) : (
        <img
          src={akkaLogoSvg}
          className={styles.sideNavLogoSvg}
          alt="akka logo"
        />
      )}

      <div className={styles.sidebarMenuWrapper}>
        <div
          className={`${styles.sidebarMenu} ${
            isActive(['/main']) ? styles.active : ''
          }`}
          onClick={() => handleNavigate('/main')}
        >
          <img
            src={
              isActive(['/main'])
                ? sidebarMenuActiveIcon
                : sidebarMenuIcon
            }
            className={styles.sidebarMenuIcon}
            alt="main"
          />
          {!folded && '메인'}
        </div>

        <div
          className={`${styles.sidebarMenu} ${
            isActive(['/write', '/expense', '/ticket']) ? styles.active : ''
          }`}
          onClick={() => handleNavigate('/write')}
        >
          <img
            src={
              isActive(['/write', '/expense', '/ticket'])
                ? sidebarWriteActiveIcon
                : sidebarWriteIcon
            }
            className={styles.sidebarMenuIcon}
            alt="write"
          />
          {!folded && '운동 기록'}
        </div>

        <div
          className={`${styles.sidebarMenu} ${
            isActive(['/report']) ? styles.active : ''
          }`}
          onClick={() => handleNavigate('/report')}
        >
          <img
            src={
              isActive(['/report'])
                ? sidebarReportActiveIcon
                : sidebarReportIcon
            }
            className={styles.sidebarMenuIcon}
            alt="report"
          />
          {!folded && '분석/리포트'}
        </div>

        <div
          className={`${styles.sidebarMenu} ${
            isActive(['/calendar']) ? styles.active : ''
          }`}
          onClick={() => handleNavigate('/calendar')}
        >
          <img
            src={
              isActive(['/calendar'])
                ? sidebarCalendarActiveIcon
                : sidebarCalendarIcon
            }
            className={styles.sidebarMenuIcon}
            alt="calendar"
          />
          {!folded && '캘린더'}
        </div>

        <div
          className={`${styles.sidebarMenu} ${
            isActive(['/mypage']) ? styles.active : ''
          }`}
          onClick={() => handleNavigate('/mypage')}
        >
          <img
            src={
              isActive(['/mypage'])
                ? sidebarSettingActiveIcon
                : sidebarSettingIcon
            }
            className={styles.sidebarMenuIcon}
            alt="mypage"
          />
          {!folded && '마이페이지'}
        </div>
      </div>

      {/* 로그인 했을 때만 프로필 표시 */}
      {user && (
        <div className={styles.sidebarProfileWrapper}>
          <div
            className={styles.sidebarProfile}
            onClick={() => handleNavigate('/mypage')}
          >
            <img
              src={
                user?.profile
                  ? `${API_BASE}${user.profile}`
                  : example
              }
              className={styles.sidebarProfileImg}
              alt="profile"
            />
          </div>

          {!folded && <div className={styles.sidebarUser}>{user.nickname}</div>}

          {!folded && (
            <img
              src={akkaLogout}
              className={styles.sidebarLogout}
              alt="logout"
              onClick={handleLogout}
            />
          )}
        </div>
      )}
    </aside>
  )
}

export default SideNav