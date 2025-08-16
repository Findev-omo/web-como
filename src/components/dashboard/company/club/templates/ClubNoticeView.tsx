"use client";

import DateFilter, {
  DateRange,
} from "@/components/dashboard/common/DateFilter";
import Pagination from "@/components/dashboard/common/Pagination";
import ClubTitle from "@/components/dashboard/shared/molecules/ClubTitle";
import { startOfToday, subYears } from "date-fns";
import { useEffect, useState } from "react";
import ClubNoticeTable, {
  ClubNotice,
  ManagerClubNotice,
} from "../organisms/ClubNoticeTable";
import { useParams } from "next/navigation";
import { useCompanyNotices } from "@/hooks/queries/company";
import Search from "@/components/dashboard/common/Search";
import type { SearchValue } from "@/lib/types/search";

const ClubNoticeView = () => {
  const params = useParams();
  const clubId = params.id as string;

  const [currentDateRange, setCurrentDateRange] = useState<DateRange>({
    startDate: subYears(startOfToday(), 1), // 1년 전 날짜
    endDate: startOfToday(),
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState<SearchValue>({
    term: "",
    field: "all",
  });

  // 매니저용 전체 동호회 공지사항 조회
  const {
    data: noticesData,
    isLoading,
    error,
  } = useCompanyNotices(currentPage, searchValue.term);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDateRangeChange = (dateRange: DateRange) => {
    setCurrentDateRange(dateRange);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    // 검색 실행 시 페이지를 1로 리셋
    setCurrentPage(1);
  };

  // 매니저용 공지사항 데이터 변환
  const notices: ManagerClubNotice[] =
    noticesData?.list?.map((notice) => ({
      id: notice.id,
      createdDate: notice.createdDate,
      title: notice.title,
      writerName: notice.writerName,
      viewCount: notice.viewCount,
      isPinned: notice.isPinned,
      clubName: "", // API에서 동호회명을 제공하지 않는 경우
    })) || [];

  return (
    <>
      <ClubTitle />
      <div className="space-y-4 p-8 rounded-2xl bg-gray-0">
        <div className="flex items-center justify-between gap-6">
          <Search
            currentValue={searchValue}
            handleChange={({ term, field }) => {
              setSearchValue({
                term: term || "",
                field: field !== undefined ? field : searchValue.field,
              });
            }}
            handleSearch={handleSearch}
          />
          <DateFilter
            currentDateRange={currentDateRange}
            handleDateRangeChange={handleDateRangeChange}
          />
        </div>
        <div className="space-y-10">
          {isLoading ? (
            <div className="text-center py-4 text-gray-500">로딩 중...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">
              에러가 발생했습니다.
            </div>
          ) : (
            <ClubNoticeTable notices={notices} isManagerView={true} />
          )}
          <div className="flex justify-center mt-8">
            <Pagination
              currentPage={currentPage}
              maxPage={noticesData?.totalPages || 1}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ClubNoticeView;
