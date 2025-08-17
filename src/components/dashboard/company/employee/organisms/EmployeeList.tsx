"use client";

import { useState, useEffect } from "react";
import { startOfToday, subYears } from "date-fns";
import DateFilter, {
  type DateRange,
} from "@/components/dashboard/common/DateFilter";
import Skeleton from "@/components/common/Skeleton";
import DocUtilButtons from "@/components/dashboard/common/DocUtil";
import Pagination from "@/components/dashboard/common/Pagination";
import EmployeeTable from "@/components/dashboard/company/employee/molecules/EmployeeTable";
import EmployeeSearch from "@/components/dashboard/company/employee/molecules/EmployeeSearch";
import { useCompanyEmployees } from "@/hooks/queries/company";
import type { SearchValue } from "@/lib/types/search";
import type { Employee } from "@/api/services/company";

export default function EmployeeList({
  initialEmployees,
}: {
  initialEmployees: Employee[];
}) {
  const [currentDateRange, setCurrentDateRange] = useState<DateRange>({
    startDate: subYears(startOfToday(), 1), // 1년 전 날짜
    endDate: startOfToday(),
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSearchValue, setCurrentSearchValue] = useState<SearchValue>({
    term: "",
    field: "all",
  });

  // react-query를 사용하여 직원 목록 가져오기
  const { data: employeeData, isLoading } = useCompanyEmployees(
    currentPage,
    currentSearchValue.term,
    currentSearchValue.field,
    currentDateRange,
    {
      list: initialEmployees,
      totalPages: 1,
    }
  );

  console.log("Employee data from react-query:", employeeData);
  console.log("Current search value:", currentSearchValue);

  const handleDateRangeChange = (dateRange: DateRange) => {
    setCurrentDateRange(dateRange);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (searchValue: SearchValue) => {
    setCurrentSearchValue(searchValue);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-8 rounded-2xl bg-gray-0">
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-64" />
      </div>
    );
  }

  const employees = employeeData?.list || [];
  const maxPage = employeeData?.totalPages || 1;

  return (
    <div className="space-y-4 p-8 rounded-2xl bg-gray-0">
      <EmployeeSearch onSearch={handleSearch} />
      <div className="flex items-center justify-between gap-6">
        <DateFilter
          currentDateRange={currentDateRange}
          handleDateRangeChange={handleDateRangeChange}
        />
        <DocUtilButtons />
      </div>
      <div className="space-y-10">
        <EmployeeTable employees={employees} />
        {employees && employees.length > 0 && (
          <div className="flex justify-center mt-8">
            <Pagination
              currentPage={currentPage}
              maxPage={maxPage}
              handlePageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
