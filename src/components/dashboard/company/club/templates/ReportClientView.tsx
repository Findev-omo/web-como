"use client";

import { useState } from "react";
import { DateRange } from "@/components/dashboard/common/DateFilter";
import ReportList from "@/components/dashboard/club/report/organisms/ReportList";
import { Activity } from "@/api/types/company/report";
import { useCompanyReports } from "@/hooks/queries/useCompanyReports";
import Skeleton from "@/components/common/Skeleton";
import DateFilter from "@/components/dashboard/common/DateFilter";
import Pagination from "@/components/dashboard/common/Pagination";
import ReportTable from "@/components/dashboard/company/club/molecules/ReportTable";

interface ReportClientViewProps {
  activities: Activity[];
  currentPage: number;
  maxPage: number;
  initialDateRange: DateRange;
}

export default function ReportClientView({
  activities: initialActivities,
  currentPage: initialCurrentPage,
  maxPage: initialMaxPage,
  initialDateRange,
}: ReportClientViewProps) {
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [currentDateRange, setCurrentDateRange] =
    useState<DateRange>(initialDateRange);

  const {
    data: reportsData,
    isLoading,
    isError,
    error,
  } = useCompanyReports(currentPage, currentDateRange, {
    list: initialActivities,
    maxPage: initialMaxPage,
  });

  const handleDateRangeChange = (dateRange: DateRange) => {
    setCurrentPage(1);
    setCurrentDateRange(dateRange);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const activities = reportsData?.list || [];
  const maxPage = reportsData?.maxPage || 1;

  return (
    <div className="space-y-4 p-8 rounded-2xl bg-gray-0">
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
            <ReportTable activities={activities} />
            <Pagination
              currentPage={currentPage}
              maxPage={maxPage}
              handlePageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}
