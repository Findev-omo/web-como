"use client";

import { useEffect, useState } from "react";
import { startOfToday, subYears } from "date-fns";
import type { SearchValue } from "@/lib/types/search";
import type { DateRange } from "@/components/dashboard/common/DateFilter";
import ApplicationSearch from "@/components/dashboard/company/club/molecules/ApplicationSearch";
import ApplicationList from "@/components/dashboard/company/club/organisms/ApplicationList";

export default function ApplicationView() {
  const [currentSearchValue, setCurrentSearchValue] = useState<SearchValue>({
    term: "",
    filter: "all", // 기본값을 "전체 보기"로 설정
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentDateRange, setCurrentDateRange] = useState<DateRange>({
    startDate: subYears(startOfToday(), 1),
    endDate: startOfToday(),
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // console.log(currentSearchValue.filter);
  }, [currentSearchValue.filter]);

  const handleSearch = (searchValue: SearchValue) => {
    console.log("검색 실행:", searchValue);
    setSearchTerm(searchValue.term);
    setCurrentSearchValue(searchValue);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  return (
    <>
      <ApplicationSearch
        onSearch={handleSearch}
        currentDateRange={currentDateRange}
        currentPage={currentPage}
      />
      <ApplicationList
        currentSearchFilter={currentSearchValue.filter!}
        currentSearchTerm={searchTerm}
      />
    </>
  );
}
