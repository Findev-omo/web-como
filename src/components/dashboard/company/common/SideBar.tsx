"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { COMPANY_DASHBOARD_ENDPOINT, HEADER_HEIGHT } from "@/lib/constants";
import { ChevronDown } from "@/assets/icons/chevron";
import OptimizedLink from "@/components/common/OptimizedLink";

const companyDashboardMenus = [
  "employee",
  "club",
  "shop",
  "como",
  "announcement",
  "community",
  "report",
  "expense",
] as const;

type CompanyDashboardMenu = (typeof companyDashboardMenus)[number];

interface SubMenuItem {
  name: string;
  link: string;
  routes: string[];
}

interface MenuItem {
  name: string;
  key: CompanyDashboardMenu;
  link?: string;
  subMenuList?: SubMenuItem[];
}

const menuList: MenuItem[] = [
  {
    name: "임직원 관리",
    key: "employee",
    subMenuList: [
      {
        name: "회원 관리",
        link: "/employee",
        routes: ["/employee", "/employee/detail"],
      },
    ],
  },
  {
    name: "사내동호회 관리",
    key: "club",
    subMenuList: [
      {
        name: "개설신청 동호회",
        link: "/club/new",
        routes: ["/club/new"],
      },
      {
        name: "사내동호회 관리",
        link: "/club",
        routes: ["/club", "/club/detail"],
      },
    ],
  },
  {
    name: "활동지원비 관리",
    key: "expense",
    subMenuList: [
      {
        name: "활동지원비 관리",
        link: "/club/expense",
        routes: ["/club/expense", "/club/expense/detail"],
      },
    ],
  },
  {
    name: "활동 보고서 관리",
    key: "report",
    subMenuList: [
      {
        name: "활동 보고서 관리",
        link: "/club/report",
        routes: ["/club/report", "/club/report/detail"],
      },
    ],
  },
];

export default function SideBar() {
  const pathname = usePathname();
  const [selectedMenu, setSelectedMenu] = useState<CompanyDashboardMenu>();
  const [selectedSubmenu, setSelectedSubMenu] = useState<string>();

  // Memoize the current path without dashboard prefix for better performance
  const currentPath = useMemo(() => {
    return pathname.replace(COMPANY_DASHBOARD_ENDPOINT, "");
  }, [pathname]);

  // Optimized path matching logic
  useEffect(() => {
    let foundMenu: CompanyDashboardMenu | undefined = undefined;
    let foundSubMenu: string | undefined = undefined;

    for (const menu of menuList) {
      if (menu.subMenuList) {
        for (const sub of menu.subMenuList) {
          if (sub.routes.includes(currentPath)) {
            foundMenu = menu.key;
            foundSubMenu = sub.link;
            break;
          }
        }
        if (foundMenu) break;
      } else if (
        menu.link &&
        COMPANY_DASHBOARD_ENDPOINT + menu.link === pathname
      ) {
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
    <nav className="relative min-w-[248px] min-h-[1080px] border-r border-gray-300 bg-gray-0 no-print">
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
              {menu.name}
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
                    href={COMPANY_DASHBOARD_ENDPOINT + subMenu.link}
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
