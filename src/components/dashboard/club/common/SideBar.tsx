"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CLUB_DASHBOARD_ENDPOINT, HEADER_HEIGHT } from "@/lib/constants";
import { ChevronDown } from "@/assets/icons/chevron";
import OptimizedLink from "@/components/common/OptimizedLink";

const clubDashboardMenus = [
  "manage",
  "shop",
  "expense",
  "announcement",
  "community",
  "report",
] as const;

type ClubDashboardMenu = (typeof clubDashboardMenus)[number];

interface SubMenuItem {
  name: string;
  link: string;
  routes: string[];
}

interface MenuItem {
  name: string;
  key: ClubDashboardMenu;
  link?: string;
  subMenuList?: SubMenuItem[];
}

const menuList: MenuItem[] = [
  {
    name: "동호회 관리",
    key: "manage",
    subMenuList: [
      {
        name: "내 동호회 관리",
        link: "/manage",
        routes: ["/manage"],
      },
      {
        name: "동호회 회원관리",
        link: "/manage/member",
        routes: ["/manage/member"],
      },
      {
        name: "동호회 일정 관리",
        link: "/manage/schedule",
        routes: ["/manage/schedule"],
      },
      // {
      //   name: "동호회 활동 캘린더",
      //   link: "/manage/calendar",
      //   routes: ["/manage/calendar"],
      // },
      // {
      //   name: "활동 보고서 작성",
      //   link: "/manage/report",
      //   routes: ["/manage/report"],
      // },
      // {
      //   name: "비품 관리",
      //   link: "/manage/supply",
      //   routes: ["/manage/supply"],
      // },
      {
        name: "공지사항 관리",
        link: "/manage/announcement",
        routes: ["/manage/announcement"],
      },
      // {
      //   name: "활동 결과 보고 작성",
      //   link: "/manage/result-report",
      //   routes: ["/manage/result-report"],
      // },
      // {
      //   name: "동호회 취소 및 해체",
      //   link: "/manage/disband",
      //   routes: ["/manage/disband"],
      // },
    ],
  },
  {
    name: "활동 보고서 관리",
    key: "report",
    link: "/report",
  },
  {
    name: "활동지원비 관리",
    key: "expense",
    link: "/expense",
  },
  // {
  //   name: "omo 예약 관리",
  //   key: "shop",
  //   subMenuList: [
  //     {
  //       name: "동호회 콘텐츠 예약",
  //       link: "/shop",
  //       routes: ["/shop", "/shop/item", "/shop/host"],
  //     },
  //     {
  //       name: "예약한 콘텐츠 관리",
  //       link: "/shop/reservation",
  //       routes: ["/shop/reservation", "/shop/review"],
  //     },
  //     {
  //       name: "1:1 문의",
  //       link: "/shop/inquiry",
  //       routes: ["/shop/inquiry"],
  //     },
  //   ],
  // },
  // {
  //   name: "활동지원비 관리",
  //   key: "expense",
  //   subMenuList: [
  //     {
  //       name: "활동지원비 관리",
  //       link: "/expense",
  //       routes: ["/expense"],
  //     },
  //   ],
  // },
  // {
  //   name: "공지사항",
  //   key: "announcement",
  //   link: "/announcement",
  // },
  // {
  //   name: "커뮤니티",
  //   key: "community",
  //   link: "/community",
  // },
  // {
  //   name: "활동 보고서",
  //   key: "report",
  //   link: "/report",
  // },
];

export default function SideBar() {
  const pathname = usePathname();
  const [selectedMenu, setSelectedMenu] = useState<ClubDashboardMenu>();
  const [selectedSubmenu, setSelectedSubMenu] = useState<string>();

  // Memoize the current path without dashboard prefix for better performance
  const currentPath = useMemo(() => {
    return pathname.replace(CLUB_DASHBOARD_ENDPOINT, "");
  }, [pathname]);

  // Optimized path matching logic
  useEffect(() => {
    if (pathname === CLUB_DASHBOARD_ENDPOINT) {
      setSelectedMenu(undefined);
      setSelectedSubMenu(undefined);
      return;
    }

    let foundMenu: ClubDashboardMenu | undefined = undefined;
    let foundSubMenu: string | undefined = undefined;

    for (const menu of menuList) {
      if (menu.key === "manage" && menu.subMenuList) {
        for (const sub of menu.subMenuList) {
          if (sub.routes.includes(currentPath)) {
            foundMenu = menu.key;
            foundSubMenu = sub.link;
            break;
          }
        }
        if (foundMenu) break;
      } else if (menu.link && currentPath.startsWith(menu.link)) {
        foundMenu = menu.key;
        break;
      }
    }

    setSelectedMenu(foundMenu);
    setSelectedSubMenu(foundSubMenu);
  }, [currentPath, pathname]);

  // Memoized click handler for better performance
  const handleMenuClick = useCallback(
    (menu: MenuItem) => {
      if (menu.key === selectedMenu) {
        setSelectedMenu(undefined);
      } else {
        setSelectedMenu(menu.key);
      }
    },
    [selectedMenu]
  );

  return (
    <nav className="relative min-w-[248px] min-h-[1080px] border-r border-gray-300 bg-gray-0">
      <ul className="sticky py-8" style={{ top: HEADER_HEIGHT }}>
        {menuList.map((menu) => (
          <li key={menu.key} className="pb-3">
            <div
              onClick={() => handleMenuClick(menu)}
              style={{ cursor: "pointer" }}
              className={cn(
                "flex items-center justify-between mb-3 py-3 px-6 h3 font-bold transition-all duration-200",
                menu.key === selectedMenu
                  ? "text-gray-0 bg-gray-900"
                  : "text-gray-800"
              )}
            >
              {menu.link ? (
                <OptimizedLink
                  href={CLUB_DASHBOARD_ENDPOINT + menu.link}
                  className="w-full"
                >
                  {menu.name}
                </OptimizedLink>
              ) : (
                menu.name
              )}
              {menu.subMenuList && (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
            {menu.subMenuList && (
              <ul
                className={cn(
                  "pb-3 mb-3",
                  menu.key === selectedMenu
                    ? "border-b border-gray-300"
                    : "hidden"
                )}
              >
                {menu.subMenuList.map((subMenu) => (
                  <OptimizedLink
                    key={subMenu.link}
                    href={CLUB_DASHBOARD_ENDPOINT + subMenu.link}
                    prefetch={true}
                  >
                    <li
                      className={cn(
                        "py-3 px-6 h4 font-medium transition-colors duration-200",
                        subMenu.routes.includes(selectedSubmenu || "")
                          ? "text-orange-500"
                          : "text-gray-700 hover:text-gray-900"
                      )}
                    >
                      {subMenu.name}
                    </li>
                  </OptimizedLink>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
