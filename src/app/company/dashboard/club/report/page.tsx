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

  const summaryPromise = getSummary(formatDate(startDate), formatDate(endDate));
  const reportsPromise = getReports(
    currentPage,
    formatDate(startDate),
    formatDate(endDate)
  );

  const [summary, reportsData] = await Promise.all([
    summaryPromise,
    reportsPromise,
  ]);

  const stats = {
    pendingCount: summary.pendingCount,
    approvedCount: summary.approvedCount,
    rejectedCount: summary.rejectedCount,
  };

  return (
    <>
      <ReportOverview stats={stats} />
      <ReportClientView
        reports={reportsData.list}
        currentPage={currentPage}
        maxPage={reportsData.maxPage}
        initialDateRange={{ startDate, endDate }}
      />
    </>
  );
}
