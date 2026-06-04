import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useSidebarStore } from "@/stores/useSidebarStore";
import { useAuthStore } from "@/stores/useAuthStore";

import styles from "./SideNav.module.css";

import akkaLogo from "@/assets/images/akka_logo.png";
import akkaLogoSvg from "@/assets/images/akka_logo_svg.png";
import akkaLogout from "@/assets/icons/akka_logout.png";

import sidebarToggleIcon from "@/assets/icons/sidebar/sidebar_toggle.png";

import sidebarMenuIcon from "@/assets/icons/sidebar/sidebar_menu.png";
import sidebarMenuActiveIcon from "@/assets/icons/sidebar/sidebar_menu_active.png";

import sidebarWriteIcon from "@/assets/icons/sidebar/sidebar_write.png";
import sidebarWriteActiveIcon from "@/assets/icons/sidebar/sidebar_write_active.png";

import sidebarReportIcon from "@/assets/icons/sidebar/sidebar_report.png";
import sidebarReportActiveIcon from "@/assets/icons/sidebar/sidebar_report_active.png";

import sidebarCalendarIcon from "@/assets/icons/sidebar/sidebar_calendar.png";
import sidebarCalendarActiveIcon from "@/assets/icons/sidebar/sidebar_calendar_active.png";

import sidebarSettingIcon from "@/assets/icons/sidebar/sidebar_setting.png";
import sidebarSettingActiveIcon from "@/assets/icons/sidebar/sidebar_setting_active.png";

import default_profile from "@/assets/icons/sidebar/default_profile.png";

const SideNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    folded,
    toggleFolded,
    setFolded,
  } = useSidebarStore();


  const {
    logout,
    token,
    isLoggedIn,
  } = useAuthStore();

  const [user, setUser] = useState<any>(null);

  const API_BASE = import.meta.env.VITE_API_URL;

  const menuItems = [
    {
      label: "메인",
      path: "/main",
      paths: ["/main"],
      icon: sidebarMenuIcon,
      activeIcon: sidebarMenuActiveIcon,
      alt: "main",
    },
    {
      label: "운동 기록",
      path: "/write",
      paths: ["/write", "/expense", "/ticket"],
      icon: sidebarWriteIcon,
      activeIcon: sidebarWriteActiveIcon,
      alt: "write",
    },
    {
      label: "분석/리포트",
      path: "/report",
      paths: ["/report"],
      icon: sidebarReportIcon,
      activeIcon: sidebarReportActiveIcon,
      alt: "report",
    },
    {
      label: "캘린더",
      path: "/calendar",
      paths: ["/calendar"],
      icon: sidebarCalendarIcon,
      activeIcon: sidebarCalendarActiveIcon,
      alt: "calendar",
    },
    {
      label: "마이페이지",
      path: "/mypage",
      paths: ["/mypage"],
      icon: sidebarSettingIcon,
      activeIcon: sidebarSettingActiveIcon,
      alt: "mypage",
    },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleMenuClick = (path: string) => {
    const publicPaths = ["/main"];

    if (!isLoggedIn && !publicPaths.includes(path)) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    navigate(path);
  };

  const isActive = (paths: string[]) => {
    return paths.some((path) =>
      location.pathname.startsWith(path)
    );
  };

  /* 반응형 */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setFolded(true);
      } else {
        setFolded(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setFolded]);

  /* 로그인 유저 */
  useEffect(() => {
    if (!token || !isLoggedIn) {
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();

        setUser(json.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [API_BASE, token, isLoggedIn]);

  /* 로그아웃 */
  const handleLogout = () => {
    logout();

    setUser(null);

    navigate("/main");
  };

  return (
    <aside
      className={`${styles.sideNav} ${folded ? styles.sideNavFolded : ""
        }`}
    >
      <div
        className={styles.sidebarToggleWrapper}
        onClick={toggleFolded}
      >
        <img
          src={sidebarToggleIcon}
          className={styles.sidebarToggleIcon}
          alt="sidebar toggle"
        />
      </div>

      {!folded ? (
        <img
          src={akkaLogo}
          className={styles.sideNavLogo}
          alt="akka logo"
          onClick={() => navigate("/main")}
        />
      ) : (
        <img
          src={akkaLogoSvg}
          className={styles.sideNavLogoSvg}
          alt="akka logo"
          onClick={() => navigate("/main")}
        />
      )}

      <div className={styles.sidebarMenuWrapper}>
        {menuItems.map((menu) => {
          const active = isActive(menu.paths);

          return (
            <div
              key={menu.path}
              className={`${styles.sidebarMenu} ${active ? styles.active : ""
                }`}
              onClick={() =>
                handleMenuClick(menu.path)
              }
            >
              <img
                src={
                  active
                    ? menu.activeIcon
                    : menu.icon
                }
                className={styles.sidebarMenuIcon}
                alt={menu.alt}
              />

              {!folded && (
                <div className={styles.sidebarText}>
                  {menu.label}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.sidebarProfileWrapper}>
        {user ? (
          <div
            className={styles.sidebarProfile}
            onClick={() =>
              handleNavigate("/mypage")
            }
          >
            <img
              src={
                user.profile_image_url
                  ? `${API_BASE}${user.profile_image_url}`
                  : default_profile
              }
              className={styles.sidebarProfileImg}
              alt="profile"
            />
          </div>
        ) : (
          <img
            src={default_profile}
            className={
              styles.sidebarProfileDefaultImg
            }
            alt="default profile"
            onClick={() =>
              handleNavigate("/login")
            }
          />
        )}

        {!folded && (
          <div className={styles.sidebarUser}>
            {user?.nickname || "로그인"}
          </div>
        )}

        {user && !folded && (
          <img
            src={akkaLogout}
            className={styles.sidebarLogout}
            alt="logout"
            onClick={handleLogout}
          />
        )}
      </div>
    </aside>
  );
};

export default SideNav;