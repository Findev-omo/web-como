"use client";

import { useState } from "react";
import { startOfToday, subYears } from "date-fns";
import type { SearchValue } from "@/lib/types/search";
import { useClubs } from "@/hooks/queries/useClubs";
import DateFilter, {
  type DateRange,
} from "@/components/dashboard/common/DateFilter";
import Pagination from "@/components/dashboard/common/Pagination";
import ClubTable from "@/components/dashboard/company/club/molecules/ClubTable";
import ClubSearch from "../molecules/ClubSearch";
import Skeleton from "@/components/common/Skeleton";

interface Props {
  currentSearchTerm: string;
  currentSearchFilter: string;
}

export default function ClubList(props: Props) {
  const [currentDateRange, setCurrentDateRange] = useState<DateRange>({
    startDate: subYears(startOfToday(), 1),
    endDate: startOfToday(),
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState<SearchValue>({
    term: props.currentSearchTerm,
    field: props.currentSearchFilter,
  });

  const {
    data: clubData,
    isLoading,
    isError,
    error,
  } = useClubs(currentPage, currentDateRange, searchValue);

  const clubs = clubData?.list || [];
  const maxPage = clubData?.totalPages || 1;

  const handleDateRangeChange = (dateRange: DateRange) => {
    setCurrentPage(1);
    setCurrentDateRange(dateRange);
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (newSearchValue: SearchValue) => {
    setCurrentPage(1);
    setSearchValue(newSearchValue);
  };

  return (
    <div className="space-y-4 p-8 rounded-2xl bg-gray-0">
      <ClubSearch
        onSearch={handleSearch}
        currentDateRange={currentDateRange}
        currentPage={currentPage}
      />
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
            <ClubTable clubs={clubs} />
            {clubs && clubs.length > 0 && (
              <Pagination
                currentPage={currentPage}
                maxPage={maxPage}
                handlePageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
