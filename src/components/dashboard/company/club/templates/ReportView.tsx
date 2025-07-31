"use client";

import { useState } from "react";
import Search from "@/components/dashboard/common/Search";
import { SearchValue } from "@/lib/types/search";
import ReportList from "../organisms/ReportList";
import { DateRange } from "@/components/dashboard/common/DateFilter";

export default function ReportView() {
  const [currentSearchValue, setCurrentSearchValue] = useState<SearchValue>({
    filter: "all",
    term: "",
  });
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleSearch = (searchValue: SearchValue) => {
    setCurrentSearchValue(searchValue);
  };

  return (
    <div className="p-8 rounded-xl bg-gray-0 space-y-6">
      <div className="flex justify-between">
        <h2 className="h2 font-semibold text-gray-900">{"활동보고서 조회"}</h2>
      </div>
      {/* <Search
        selectOptions={[{ value: "all", label: "전체" }]}
        currentSearchFilter={currentSearchValue.filter!}
        handleSearch={handleSearch}
      /> */}
      <ReportList
        activities={[]}
        currentPage={1}
        maxPage={1}
        currentDateRange={dateRange}
        handleDateRangeChange={setDateRange}
        handlePageChange={() => {}}
      />
    </div>
  );
}
