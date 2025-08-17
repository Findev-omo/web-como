import ReportOverview from "@/components/dashboard/company/club/molecules/ReportOverview";
import { getSummary } from "@/api/actions/company/report/getSummary";
import { getReports } from "@/api/actions/company/report/getReports";
import { formatDate } from "@/lib/format";
import { startOfToday, startOfYear } from "date-fns";
import ReportClientView from "@/components/dashboard/company/club/templates/ReportClientView";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const startDate = searchParams.startDate
    ? new Date(searchParams.startDate as string)
    : startOfYear(new Date());
  const endDate = searchParams.endDate
    ? new Date(searchParams.endDate as string)
    : startOfToday();

  console.log("보고서 페이지 - 파라미터:", {
    currentPage,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  });

  const summaryPromise = getSummary(formatDate(startDate), formatDate(endDate));
  const reportsPromise = getReports(
    currentPage,
    formatDate(startDate),
    formatDate(endDate)
  );

  try {
    const [summary, reportsData] = await Promise.all([
      summaryPromise,
      reportsPromise,
    ]);

    // 목록 API에서 받은 데이터를 그대로 사용
    // TODO: 상세 API가 완성되면 clubName 등의 추가 정보를 가져오도록 수정
    const reportsWithDetails = reportsData.list.map((report) => {
      console.log(`보고서 ${report.id} 원본 데이터:`, report);
      return {
        ...report,
        // 목록 API에서 clubName이 제공되지 않으면 기본값 사용
        clubName: (report as any).clubName || "동호회명",
        writerName: (report as any).writerName || "작성자",
        activityContent: (report as any).activityContent || "",
        location: (report as any).location || "",
        participantCount: (report as any).participantCount || 0,
      };
    });

    console.log("보고서 페이지 - API 응답:", { summary, reportsData });
    console.log("reportsData 원본 구조:", JSON.stringify(reportsData, null, 2));
    console.log("reportsData.list 첫 번째 항목:", reportsData.list[0]);

    // 각 보고서 항목의 정보 출력
    if (reportsWithDetails && reportsWithDetails.length > 0) {
      console.log("보고서 목록 정보:");
      reportsWithDetails.forEach((report, index) => {
        console.log(`보고서 ${index + 1}:`, {
          id: report.id,
          activityDate: report.activityDate,
          status: report.status,
          clubName: report.clubName,
          eventName: report.eventName,
          writerName: report.writerName,
          activityContent: report.activityContent,
          location: report.location,
          participantCount: report.participantCount,
          // 전체 객체도 출력
          fullReport: report,
        });
      });
    } else {
      console.log("보고서 목록이 비어있습니다.");
    }

    const stats = {
      pendingCount: summary.pendingCount,
      approvedCount: summary.approvedCount,
      rejectedCount: summary.rejectedCount,
    };

    return (
      <>
        <ReportOverview stats={stats} />
        <ReportClientView
          reports={reportsWithDetails}
          currentPage={currentPage}
          maxPage={reportsData.maxPage}
          initialDateRange={{ startDate, endDate }}
        />
      </>
    );
  } catch (error) {
    console.error("보고서 페이지 에러:", error);
    throw error;
  }
}
