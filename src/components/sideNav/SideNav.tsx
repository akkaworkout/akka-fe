import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BsGridFill } from 'react-icons/bs'
import { FaRegCalendarCheck } from 'react-icons/fa6'
import { IoMdSettings } from 'react-icons/io'
import { IoLogOut } from 'react-icons/io5'
import { LuClipboardPenLine, LuPanelLeft } from 'react-icons/lu'
import { MdInsertChart } from 'react-icons/md'
import type { IconType } from 'react-icons'

import api, { buildApiUrl } from '@/api/api'

import { useSidebarStore } from '@/stores/useSidebarStore'
import { useAuthStore } from '@/stores/useAuthStore'
import Skeleton from '@/components/skeleton/Skeleton'

import styles from './SideNav.module.css'

import akkaLogo from '@/assets/brand/akka-logo.png'
import akkaLogoSvg from '@/assets/brand/akka-logo-symbol.png'

import default_profile from '@/assets/icons/sidebar/default-profile.png'

type SidebarUser = {
  nickname: string
  profile_image_url?: string | null
}

type MenuItem = {
  label: string
  path: string
  paths: string[]
  Icon: IconType
}

const SideNav = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const { folded, toggleFolded, setFolded } = useSidebarStore()

  const { logout, token, isLoggedIn } = useAuthStore()

  const [user, setUser] = useState<SidebarUser | null>(null)
  const [isUserLoading, setIsUserLoading] = useState(false)
  const [profileImageError, setProfileImageError] = useState(false)

  const menuItems: MenuItem[] = [
    {
      label: '메인',
      path: '/main',
      paths: ['/', '/main'],
      Icon: BsGridFill,
    },
    {
      label: '운동 기록',
      path: '/write',
      paths: ['/write', '/expense', '/ticket'],
      Icon: LuClipboardPenLine,
    },
    {
      label: '분석/리포트',
      path: '/report',
      paths: ['/report'],
      Icon: MdInsertChart,
    },
    {
      label: '캘린더',
      path: '/calendar',
      paths: ['/calendar'],
      Icon: FaRegCalendarCheck,
    },
    {
      label: '마이페이지',
      path: '/mypage',
      paths: ['/mypage'],
      Icon: IoMdSettings,
    },
  ]

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  const handleMenuClick = (path: string) => {
    const publicPaths = ['/main']

    if (!isLoggedIn && !publicPaths.includes(path)) {
      alert('로그인하고 이용할 수 있어요')
      navigate('/login')
      return
    }

    navigate(path)
  }

  const isActive = (paths: string[]) => {
    return paths.some((path) =>
      path === '/' ? location.pathname === path : location.pathname.startsWith(path),
    )
  }

  /* 반응형 */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setFolded(true)
      } else {
        setFolded(false)
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [setFolded])

  /* 로그인 유저 */
  useEffect(() => {
    if (!token || !isLoggedIn) {
      return
    }

    const fetchUser = async () => {
      try {
        setIsUserLoading(true)
        const { data } = await api.get<{ data: SidebarUser }>('/users/me')

        setUser(data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsUserLoading(false)
      }
    }

    fetchUser()
  }, [token, isLoggedIn])

  useEffect(() => {
    setProfileImageError(false)
  }, [user?.profile_image_url])

  /* 로그아웃 */
  const handleLogout = () => {
    logout()

    setUser(null)

    alert('안전하게 로그아웃했어요')

    navigate('/main')
  }

  return (
    <aside className={`${styles.sideNav} ${folded ? styles.sideNavFolded : ''}`}>
      <button
        type="button"
        className={styles.sidebarToggleWrapper}
        onClick={toggleFolded}
        aria-label="사이드바 접기 및 펼치기"
      >
        <LuPanelLeft className={styles.sidebarToggleIcon} aria-hidden="true" />
      </button>

      {!folded ? (
        <img
          src={akkaLogo}
          className={styles.sideNavLogo}
          alt="akka logo"
          onClick={() => navigate('/main')}
        />
      ) : (
        <img
          src={akkaLogoSvg}
          className={styles.sideNavLogoSvg}
          alt="akka logo"
          onClick={() => navigate('/main')}
        />
      )}

      <div className={styles.sidebarMenuWrapper}>
        {menuItems.map((menu) => {
          const active = isActive(menu.paths)
          const MenuIcon = menu.Icon

          return (
            <div
              key={menu.path}
              className={`${styles.sidebarMenu} ${active ? styles.active : ''}`}
              onClick={() => handleMenuClick(menu.path)}
            >
              <MenuIcon className={styles.sidebarMenuIcon} aria-hidden="true" />

              {!folded && <div className={styles.sidebarText}>{menu.label}</div>}
            </div>
          )
        })}
      </div>

      <div className={styles.sidebarProfileWrapper}>
        {isLoggedIn && isUserLoading ? (
          <Skeleton width={45} height={43} borderRadius={12} />
        ) : isLoggedIn && user ? (
          user.profile_image_url?.trim() && !profileImageError ? (
            <div className={styles.sidebarProfile} onClick={() => handleNavigate('/mypage')}>
              <img
                src={buildApiUrl(user.profile_image_url)}
                className={styles.sidebarProfileImg}
                alt="프로필"
                onError={() => setProfileImageError(true)}
              />
            </div>
          ) : (
            <img
              src={default_profile}
              className={styles.sidebarProfileDefaultImg}
              alt="기본 프로필"
              onClick={() => handleNavigate('/mypage')}
            />
          )
        ) : (
          <img
            src={default_profile}
            className={styles.sidebarProfileDefaultImg}
            alt="기본 프로필"
            onClick={() => handleNavigate('/login')}
          />
        )}

        {!folded &&
          (isLoggedIn && isUserLoading ? (
            <Skeleton className={styles.sidebarUserSkeleton} width={72} height={12} />
          ) : (
            <div className={styles.sidebarUser}>
              {isLoggedIn && user ? user.nickname : '로그인'}
            </div>
          ))}

        {isLoggedIn && user && !folded && (
          <button
            type="button"
            className={styles.sidebarLogout}
            onClick={handleLogout}
            aria-label="로그아웃"
          >
            <IoLogOut aria-hidden="true" />
          </button>
        )}
      </div>
    </aside>
  )
}

export default SideNav
