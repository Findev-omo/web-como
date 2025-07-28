"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DateRange } from "@/components/dashboard/common/DateFilter";
import ReportList from "@/components/dashboard/company/club/organisms/ReportList";
import { Activity } from "@/api/types/company/report";
import { formatDate } from "@/lib/format";

interface ReportClientViewProps {
  activities: Activity[];
  currentPage: number;
  maxPage: number;
  initialDateRange: DateRange;
}

export default function ReportClientView({
  activities,
  currentPage,
  maxPage,
  initialDateRange,
}: ReportClientViewProps) {
  const router = useRouter();
  const [currentDateRange, setCurrentDateRange] =
    useState<DateRange>(initialDateRange);

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
    <ReportList
      activities={activities}
      currentPage={currentPage}
      maxPage={maxPage}
      currentDateRange={currentDateRange}
      handleDateRangeChange={handleDateRangeChange}
      handlePageChange={handlePageChange}
    />
  );
}
