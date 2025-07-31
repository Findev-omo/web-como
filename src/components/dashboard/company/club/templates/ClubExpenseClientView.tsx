"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Pagination from "@/components/dashboard/common/Pagination";
import ExpenseTable from "@/components/dashboard/company/club/molecules/ExpenseTable";
import DateFilter, {
  DateRange,
} from "@/components/dashboard/common/DateFilter";
import { ExpenseApplicationEntry } from "@/api/types/company/expense";
import { formatDate } from "@/lib/format";

interface ClubExpenseClientViewProps {
  expenseList: ExpenseApplicationEntry[];
  currentPage: number;
  maxPage: number;
  initialDateRange: DateRange;
}

export default function ClubExpenseClientView({
  expenseList,
  currentPage,
  maxPage,
  initialDateRange,
}: ClubExpenseClientViewProps) {
  const router = useRouter();
  const [currentDateRange, setCurrentDateRange] =
    useState<DateRange>(initialDateRange);
  const today = new Date();

  const handleDateRangeChange = (dateRange: DateRange) => {
    setCurrentDateRange(dateRange);
    if (dateRange.startDate && dateRange.endDate) {
      const params = new URLSearchParams();
      params.set("startDate", formatDate(dateRange.startDate));
      params.set("endDate", formatDate(dateRange.endDate));
      router.push(`?${params.toString()}`);
    }
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (currentDateRange.startDate) {
      params.set("startDate", formatDate(currentDateRange.startDate));
    }
    if (currentDateRange.endDate) {
      params.set("endDate", formatDate(currentDateRange.endDate));
    }
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
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
          <ExpenseTable
            expenseList={expenseList}
            currentPage={currentPage}
            startDate={formatDate(
              currentDateRange.startDate || new Date("2025-01-01")
            )}
            endDate={formatDate(currentDateRange.endDate || today)}
          />
          <Pagination
            currentPage={currentPage}
            maxPage={maxPage}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
