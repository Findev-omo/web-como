"use client";

import { useEffect, useState } from "react";
import { DateRange } from "@/components/dashboard/common/DateFilter";
import Skeleton from "@/components/common/Skeleton";
import DateFilter from "@/components/dashboard/common/DateFilter";
import Pagination from "@/components/dashboard/common/Pagination";
import ReportTable from "@/components/dashboard/company/club/molecules/ReportTable";
import { useCompanyReports } from "@/hooks/queries/company";
import { useRouter } from "next/navigation";
import { CompanyReport } from "@/api/services/company";

interface ReportClientViewProps {
  reports: CompanyReport[];
  currentPage: number;
  maxPage: number;
  initialDateRange: DateRange;
}

export default function ReportClientView({
  reports: initialReports,
  currentPage: initialCurrentPage,
  maxPage: initialMaxPage,
  initialDateRange,
}: ReportClientViewProps) {
  console.log("ReportClientView props:", {
    initialReports,
    initialCurrentPage,
    initialMaxPage,
    initialDateRange,
  });
  const router = useRouter();
  const [currentDateRange, setCurrentDateRange] =
    useState<DateRange>(initialDateRange);

  useEffect(() => {
    setCurrentDateRange(initialDateRange);
  }, [initialDateRange]);

  const {
    data: reportsData,
    isLoading,
    isError,
    error,
  } = useCompanyReports(initialCurrentPage, currentDateRange, {
    list: initialReports,
    totalPages: initialMaxPage,
  });

  console.log("useCompanyReports 결과:", {
    reportsData,
    isLoading,
    isError,
    error,
  });

  const updateUrl = (page: number, dateRange: DateRange) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (dateRange.startDate) {
      params.set("startDate", dateRange.startDate.toISOString());
    }
    if (dateRange.endDate) {
      params.set("endDate", dateRange.endDate.toISOString());
    }
    router.push(`/company/dashboard/club/report?${params.toString()}`);
  };

  const handleDateRangeChange = (dateRange: DateRange) => {
    setCurrentDateRange(dateRange);
    updateUrl(1, dateRange);
  };

  const handlePageChange = (page: number) => {
    updateUrl(page, currentDateRange);
  };

  const reports = reportsData?.list || [];
  const maxPage = reportsData?.totalPages || 1;

  console.log("최종 데이터:", {
    reports,
    maxPage,
    reportsLength: reports.length,
  });

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
            <ReportTable reports={reports} />
            <Pagination
              currentPage={initialCurrentPage}
              maxPage={maxPage}
              handlePageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}
