import { getSummary } from "@/api/actions/company/expense/getSummary";
import { getExpense } from "@/api/actions/company/expense/getExpense";
import ExpenseOverview from "@/components/dashboard/company/club/molecules/ExpenseOverview";
import { formatDate } from "@/lib/format";
import ExpenseRejectDetailModal from "@/components/dashboard/company/club/modals/ExpenseRejectDetailModal";
import ClubExpenseClientView from "@/components/dashboard/company/club/templates/ClubExpenseClientView";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const today = new Date();
  const currentPage = Number(searchParams.page) || 1;
  const startDate = searchParams.startDate
    ? new Date(searchParams.startDate as string)
    : new Date("2025-01-01");
  const endDate = searchParams.endDate
    ? new Date(searchParams.endDate as string)
    : today;

  const summaryPromise = getSummary();
  const expensePromise = getExpense(
    currentPage,
    formatDate(startDate),
    formatDate(endDate)
  );

  try {
    const [summary, expenseData] = await Promise.all([
      summaryPromise,
      expensePromise,
    ]);

    const stats = {
      pending: summary.pendingCount || 0,
      approved: summary.approvedCount || 0,
      rejected: summary.rejectedCount || 0,
    };

    return (
      <>
        <ExpenseOverview stats={stats} />
        <ClubExpenseClientView
          expenseList={expenseData.list}
          currentPage={currentPage}
          maxPage={expenseData.maxPage}
          initialDateRange={{ startDate, endDate }}
        />
        {/* <ExpenseRejectDetailModal /> */}
      </>
    );
  } catch (error) {
    console.error("지출 관리 페이지 에러:", error);
    throw error;
  }
}
