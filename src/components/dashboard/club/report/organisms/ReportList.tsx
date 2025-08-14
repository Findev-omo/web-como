"use client";

import { useState } from "react";

import { addDays, startOfToday, format, addYears } from "date-fns";
import DateFilter, {
  type DateRange,
} from "@/components/dashboard/common/DateFilter";
import ReportTable from "@/components/dashboard/club/report/molecules/ReportTable";
import ReportTableSkeleton from "@/components/dashboard/club/report/molecules/ReportTableSkeleton";
import Pagination from "@/components/dashboard/common/Pagination";
import { useQuery } from "@tanstack/react-query";
import { getClubReports } from "@/api/actions/club/report/getReports";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  clubId: string | undefined;
}

export default function ReportList({ clubId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentDateRange, setCurrentDateRange] = useState<DateRange>({
    startDate: addYears(startOfToday(), -1),
    endDate: startOfToday(),
  });

  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleDateRangeChange = (dateRange: DateRange) => {
    setCurrentDateRange(dateRange);
  };

  const formatDate = (date: Date | undefined) => {
    if (date) {
      return format(date, "yyyy-MM-dd");
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: [
      clubId,
      "reportList",
      currentDateRange.startDate,
      currentDateRange.endDate,
      currentPage,
    ],
    queryFn: async () => {
      return getClubReports(
        clubId,
        currentPage,
        formatDate(currentDateRange.startDate)!,
        formatDate(currentDateRange.endDate)!
      );
    },
    staleTime: 60_000,
    gcTime: 300_000,
  });

  const handlePageChange = (page: number) => {
    if (page !== currentPage) setCurrentPage(page);
  };

  const maxPage = data?.totalPages ?? 1;

  return (
    <div className="space-y-10 p-8 rounded-2xl bg-gray-0">
      <div className="flex items-center justify-between">
        <span className="font-[600] text-2xl ">활동보고서 조회</span>
        <button
          className=" text-base px-[12px] py-[4px] bg-gray-900 text-gray-100 rounded-[4px]"
          onClick={() => router.push(`/club/dashboard/result-report`)}
        >
          보고서 작성하기 +
        </button>
      </div>
      <div className="space-y-4">
        <DateFilter
          currentDateRange={currentDateRange}
          handleDateRangeChange={handleDateRangeChange}
        />
        {isLoading ? (
          <ReportTableSkeleton />
        ) : (
          <ReportTable
            data={data ? [{ data }] : []}
            clubId={clubId}
            currentPage={currentPage}
          />
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        maxPage={maxPage}
      />
    </div>
  );
}
