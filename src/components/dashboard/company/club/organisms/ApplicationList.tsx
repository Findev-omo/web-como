"use client";

import { useState } from "react";
import { startOfToday, subYears } from "date-fns";
import type { SearchValue } from "@/lib/types/search";
import DateFilter, {
  type DateRange,
} from "@/components/dashboard/common/DateFilter";
import Pagination from "@/components/dashboard/common/Pagination";
import ApplicationTable from "@/components/dashboard/company/club/molecules/ApplicationTable";
import ApplicationSearch from "@/components/dashboard/company/club/molecules/ApplicationSearch";
import Skeleton from "@/components/common/Skeleton";
import { useApplications } from "@/hooks/queries/useApplications";

interface Props {
  currentSearchTerm: string;
  currentSearchFilter: string;
}

export default function ApplicationList(props: Props) {
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
    data: applicationData,
    isLoading,
    isError,
    error,
  } = useApplications(currentPage, currentDateRange, searchValue);

  const applications = applicationData?.memberList || [];
  const maxPage = applicationData?.maxPage || 1;

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
      <ApplicationSearch
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
            <ApplicationTable applications={applications} />
            {applications && applications.length > 0 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  currentPage={currentPage}
                  maxPage={maxPage}
                  handlePageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
