import ExpenseList from "../organisms/ExpenseList";
import ExpenseOverview from "../molecules/ExpenseOverview";
import { useState } from "react";
import { DateRange } from "@/components/dashboard/common/DateFilter";

export default function ClubExpenseTabView() {
  const dummyStats = {
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date(),
  });

  return (
    <>
      <ExpenseOverview stats={dummyStats} />
      <ExpenseList
        expenseList={[]}
        currentPage={1}
        maxPage={1}
        currentDateRange={dateRange}
        handleDateRangeChange={setDateRange}
        handlePageChange={() => {}}
      />
    </>
  );
}
