"use client";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect } from "react";
import { getData } from "@/api/action";
import BackButton from "@/components/dashboard/common/BackButton";
import ClubDetailMenuTabs from "@/components/dashboard/company/club/molecules/ClubDetailMenuTabs";
import ClubDetailAboutTabView from "@/components/dashboard/company/club/templates/ClubDetailAboutTabView";
import ClubDetailActivityTabView from "@/components/dashboard/company/club/templates/ClubDetailActivityTabView";
import ClubDetailPictureTabView from "@/components/dashboard/company/club/templates/ClubDetailPictureTabView";
import ClubDetailAttendanceTabView from "@/components/dashboard/company/club/templates/ClubDetailAttendanceTabView";
import ClubDetailAttendanceDetailTabView from "@/components/dashboard/company/club/templates/ClubDetailAttendanceDetailTabView";
import ForceDisbandClubFormModal from "@/components/dashboard/company/club/modals/ForceDisbandClubFormModal";
import CancelForceDisbandModal from "@/components/dashboard/company/club/modals/CancelForceDisbandModal";
import ViewReportModal from "@/components/dashboard/company/club/modals/ViewReportModal";
import ClubNoticeView from "@/components/dashboard/company/club/templates/ClubNoticeView";
import useClubDetailStore from "@/lib/store/clubDetailStore";

export type ClubDetailMenu =
  | "about"
  | "activity"
  | "picture"
  | "attendance"
  | "notice";

export interface ClubDetailMenuTab {
  name: string;
  value: ClubDetailMenu;
}

const tabList: ClubDetailMenuTab[] = [
  { name: "동호회 상세", value: "about" },
  { name: "일정", value: "activity" },
  { name: "활동 사진", value: "picture" },
  // { name: "출석부", value: "attendance" },
  { name: "공지", value: "notice" },
];

const renderCurrentTabPage = (
  currentTab: ClubDetailMenu,
  // attendanceId: string | null,
  clubId: string | null
) => {
  switch (currentTab) {
    case "about":
      return <ClubDetailAboutTabView />;
    case "activity":
      return <ClubDetailActivityTabView />;
    case "picture":
      return <ClubDetailPictureTabView />;
    case "notice":
      return <ClubNoticeView />;
    // case "attendance":
    //   if (attendanceId) {
    //   return <ClubDetailAttendanceDetailTabView />;
    // } else {
    //   return <ClubDetailAttendanceTabView />;
    // }
    default:
      return <ClubDetailAboutTabView />;
  }
};

export default function Page() {
  const { push } = useRouter();
  const pathname = usePathname();
  const currentTab = (useSearchParams().get("tab") ||
    "about") as ClubDetailMenu;
  const attendanceId = useSearchParams().get("id");
  const params = useParams();
  const clubId = params.id as string;

  const { setClubDetail, setLoading } = useClubDetailStore();

  // 클럽 상세 정보를 가져와서 스토어에 저장
  useEffect(() => {
    const fetchClubDetail = async () => {
      if (!clubId) return;

      setLoading(true);
      try {
        const response = await getData(`v1/manager/club/${clubId}`, false);
        if (response.resultCode === "200" && response.data) {
          setClubDetail(response.data);
        }
      } catch (error) {
        console.error("클럽 상세 정보 로딩 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubDetail();
  }, [clubId, setClubDetail, setLoading]);

  const handleTabChange = (value: ClubDetailMenu) => {
    push(`${pathname}?tab=${value}`);
  };

  return (
    <>
      <BackButton />
      <ClubDetailMenuTabs
        tabs={tabList}
        currentTab={currentTab}
        handleTabChange={handleTabChange}
      />
      {renderCurrentTabPage(currentTab, clubId)}
      <div className="m-0">
        <ForceDisbandClubFormModal />
        <CancelForceDisbandModal />
        <ViewReportModal />
      </div>
    </>
  );
}
