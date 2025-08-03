"use client";

import { useState } from "react";
import Pagination from "@/components/dashboard/common/Pagination";
import ExpenseTable from "@/components/dashboard/company/club/molecules/ExpenseTable";
import DateFilter, {
  DateRange,
} from "@/components/dashboard/common/DateFilter";
import { CompanyExpenseEntry } from "@/api/services/company";
import { formatDate } from "@/lib/format";
import { useCompanyExpenses } from "@/hooks/queries/company";
import Skeleton from "@/components/common/Skeleton";

interface ClubExpenseClientViewProps {
  expenseList: CompanyExpenseEntry[];
  currentPage: number;
  maxPage: number;
  initialDateRange: DateRange;
}

export default function ClubExpenseClientView({
  expenseList,
  currentPage: initialCurrentPage,
  maxPage: initialMaxPage,
  initialDateRange,
}: ClubExpenseClientViewProps) {
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [currentDateRange, setCurrentDateRange] =
    useState<DateRange>(initialDateRange);
  const today = new Date();

  const {
    data: expenseData,
    isLoading,
    isError,
    error,
  } = useCompanyExpenses(
    currentPage,
    currentDateRange,
    currentPage === initialCurrentPage
      ? {
          list: expenseList,
          maxPage: initialMaxPage,
        }
      : undefined
  );

  const handleDateRangeChange = (dateRange: DateRange) => {
    setCurrentPage(1);
    setCurrentDateRange(dateRange);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6 p-8 rounded-xl bg-gray-0">
      <div className="flex justify-between">
        <h3 className="h2 font-semibold text-gray-900">
          {"활동비 지급 내역 조회"}
        </h3>
      </div>

      <div className="space-y-4">
        <DateFilter
          currentDateRange={currentDateRange}
          handleDateRangeChange={handleDateRangeChange}
        />
        <div className="space-y-10">
          {isLoading ? (
            <Skeleton className="w-full h-96" />
          ) : isError ? (
            <div>Error: {error.message}</div>
          ) : (
            <>
              <ExpenseTable
                expenseList={expenseData?.list || []}
                currentPage={currentPage}
                startDate={formatDate(
                  currentDateRange.startDate || new Date("2025-01-01")
                )}
                endDate={formatDate(currentDateRange.endDate || today)}
              />
              <Pagination
                currentPage={currentPage}
                maxPage={expenseData?.maxPage || 1}
                handlePageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
