import { useState } from 'react'

import styles from './SideNav.module.css'
import akkaLogo from '../../assets/images/akka_logo.png'
import akkaLogoSvg from '../../assets/images/akka_logo_svg.png'
import akkaLogout from '../../assets/images/akka_logout.png'
import sidebarToggleIcon from '../../assets/images/sidebar_toggle.png'
import sidebarMenuIcon from '../../assets/images/sidebar_menu.png'
import sidebarWriteIcon from '../../assets/images/sidebar_write.png'
import sidebarReportIcon from '../../assets/images/sidebar_report.png'
import sidebarCalenderIcon from '../../assets/images/sidebar_calender.png'
import sidebarSettingIcon from '../../assets/images/sidebar_setting.png'
import example from '../../assets/images/example.png'

const SideNav = () => {
  const [foldSidebar, setFoldSidebar] = useState(false)
  const [activeMenu, setActiveMenu] = useState('main')

  const handleToggleClick = () => {
    setFoldSidebar(prev => !prev)
  }

  const handleOnClick = (menu: string) => {
    setActiveMenu(menu)
  }

  return (
    <aside
      className={`${styles.sideNav} ${foldSidebar ? styles.sideNavFolded : ''}`}
    >
      {/* 토글 버튼 */}
      <div className={styles.sidebarToggleWrapper} onClick={handleToggleClick}>
        <img
          src={sidebarToggleIcon}
          className={styles.sidebarToggleIcon}
          alt="sidebar toggle"
        />
      </div>

      {/* 로고 */}
      {!foldSidebar ? (
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
          className={`${styles.sidebarMenu} ${
            activeMenu === 'main' ? styles.active : ''
          }`}
          onClick={() => handleOnClick('main')}
        >
          <img src={sidebarMenuIcon} className={styles.sidebarMenuIcon} />
          {!foldSidebar && '메인'}
        </div>

        <div
          className={`${styles.sidebarMenu} ${
            activeMenu === 'write' ? styles.active : ''
          }`}
          onClick={() => handleOnClick('write')}
        >
          <img src={sidebarWriteIcon} className={styles.sidebarMenuIcon} />
          {!foldSidebar && '운동 기록'}
        </div>

        <div
          className={`${styles.sidebarMenu} ${
            activeMenu === 'report' ? styles.active : ''
          }`}
          onClick={() => handleOnClick('report')}
        >
          <img src={sidebarReportIcon} className={styles.sidebarMenuIcon} />
          {!foldSidebar && '분석/리포트'}
        </div>

        <div
          className={`${styles.sidebarMenu} ${
            activeMenu === 'calendar' ? styles.active : ''
          }`}
          onClick={() => handleOnClick('calendar')}
        >
          <img src={sidebarCalenderIcon} className={styles.sidebarMenuIcon} />
          {!foldSidebar && '캘린더'}
        </div>

        <div
          className={`${styles.sidebarMenu} ${
            activeMenu === 'mypage' ? styles.active : ''
          }`}
          onClick={() => handleOnClick('mypage')}
        >
          <img src={sidebarSettingIcon} className={styles.sidebarMenuIcon} />
          {!foldSidebar && '마이페이지'}
        </div>
      </div>

      {/* 프로필 */}
      <div className={styles.sidebarProfileWrapper}>
        <div className={styles.sidebarProfile}>
          <img src={example} className={styles.sidebarProfileImg} />
        </div>

        {!foldSidebar && <div className={styles.sidebarUser}>Minju Lee</div>}
        {!foldSidebar && (
          <img src={akkaLogout} className={styles.sidebarLogout} />
        )}
      </div>
    </aside>
  )
}

export default SideNav