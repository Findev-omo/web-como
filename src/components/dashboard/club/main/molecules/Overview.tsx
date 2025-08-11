"use client";

import Link from "next/link";
import { getData } from "@/api/action";
import type { NotificationData } from "@/api/types/club/notification";
import { LOGIN_ENDPOINT, CLUB_DASHBOARD_ENDPOINT } from "@/lib/constants";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// 개발 중간에 엔드 포인트가 변경되어 getData 사용 시 모든 참조를 찾아서 일일이 수정해야 합니다. 권장 x...
// const getClubJoinRequest = async () => {
//   const [clubId, token] = await Promise.all([getClubId(), getAccessToken()]);

//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/executive/club/${clubId}/count/pending`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       cache: "force-cache",
//     }
//   );

//   return res.json();
// };

export default function DashboardOverview() {
  // const res = await getData("v2/club/web/notification/", true);
  // const data: NotificationData = res.data;

  // 이후 주무부서 공지사항, 최근 omo 공지사항 연동해야함
  // const [clubJoinRequest] = await Promise.all([getClubJoinRequest()]);
  // console.log(clubJoinRequest);

  const [dashboardNotifications, setDashboardNotifications] =
    useState<NotificationData>();
  const getDashboardNotifications = useCallback(async () => {
    try {
      const response = await fetch(
        "/api/server/v1/executive/club/{clubId}/dashboard/notifications",
        { headers: { "Content-Type": "application/json" } }
      );
      const res = await response.json();
      if (res.resultCode === "OK") {
        setDashboardNotifications(res.data);
      }
    } catch (error) {
      console.error("알림 카드 목록 조회 에러:", error);
    }
  }, [setDashboardNotifications]);

  useEffect(() => {
    getDashboardNotifications();
  }, [getDashboardNotifications]);

  const router = useRouter();

  const handleCardClick = useCallback(
    (type: keyof NotificationData) => {
      let path = "";
      switch (type) {
        case "newJoinRequests":
          path = "/manage?tab=member";
          break;
        case "recentManagerNotices":
          path = "/announcement/document";
          break;
        case "recentOmoNotices":
          path = "/announcement/document"; // OMO 공지사항 경로 확인 필요
          break;
        default:
          path = "/";
      }
      router.push(CLUB_DASHBOARD_ENDPOINT + path);
    },
    [router]
  );

  return (
    <div className="col-span-4 flex flex-col gap-6 h-fit p-8 rounded-xl bg-gray-800 select-none">
      <h3 className="h1 font-bold text-gray-0">{`${dashboardNotifications?.clubName || "동호회"} 주요 알림`}</h3>
      <div className="grid grid-cols-3 gap-y-6">
        <div
          className="flex flex-col gap-3 cursor-pointer"
          onClick={() => handleCardClick("newJoinRequests")}
        >
          <p className="h4 font-medium text-gray-500">{"가입 신청"}</p>
          <p className="h1 font-extrabold text-brand-orange">
            {`${dashboardNotifications?.newJoinRequests || 0}명`}
          </p>
        </div>
        <div
          className="flex flex-col gap-3 cursor-pointer"
          onClick={() => handleCardClick("recentManagerNotices")}
        >
          <p className="h4 font-medium text-gray-500">{"주무부서 공지사항"}</p>
          <p className="h1 font-extrabold text-gray-800">
            {`${dashboardNotifications?.recentManagerNotices || 0}건`}
          </p>
        </div>
        <div
          className="flex flex-col gap-3 cursor-pointer"
          onClick={() => handleCardClick("recentOmoNotices")}
        >
          <p className="h4 font-medium text-gray-500">{"최근 OMO 공지사항"}</p>
          <p className="h1 font-extrabold text-gray-800">
            {`${dashboardNotifications?.recentOmoNotices || 0}건`}
          </p>
        </div>
        <Link
          href={`${CLUB_DASHBOARD_ENDPOINT}/faq`}
          className="col-span-3 pt-6 border-t border-gray-200"
        >
          <span className="h4 font-medium text-gray-500">
            {"도움이 필요하신가요?"}
          </span>
        </Link>
      </div>
    </div>
  );
}
