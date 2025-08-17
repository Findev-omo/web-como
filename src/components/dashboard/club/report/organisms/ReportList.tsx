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
import { getData } from "@/api/action";
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
    setCurrentPage(1); // 날짜 변경 시 첫 페이지로 리셋
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
    queryFn: () => {
      // 서버가 페이지 번호를 1부터 시작하므로, 클라이언트에서도 1부터 시작
      // 하지만 서버에서 페이지 번호를 1 증가시켜서 처리한다면, 클라이언트에서 1 감소시켜서 보내야 함
      const adjustedPage = currentPage - 1; // 서버가 1 증가시켜서 처리한다면
      const url = `v1/executive/club/${clubId}/reports?startDate=${formatDate(currentDateRange.startDate)}&endDate=${formatDate(currentDateRange.endDate)}&page=${adjustedPage}`;
      console.log("API 호출 URL:", url);
      console.log("API 호출 파라미터:", {
        startDate: formatDate(currentDateRange.startDate),
        endDate: formatDate(currentDateRange.endDate),
        page: currentPage,
        adjustedPage: adjustedPage,
      });
      return getData(url, false);
    },
    enabled: !!clubId,
  });

  // 디버깅을 위한 로그
  console.log("ReportList data:", data);
  console.log("ReportList isLoading:", isLoading);
  console.log("ReportList currentPage:", currentPage);

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const maxPage = data?.data?.maxPage || 1;

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
            data={data ? [data] : []}
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
