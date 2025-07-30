"use client";

import { useState, useEffect, useRef } from "react";
import { startOfToday, subYears } from "date-fns";
import { getData } from "@/api/action";
import DateFilter, {
  type DateRange,
} from "@/components/dashboard/common/DateFilter";
import Skeleton from "@/components/common/Skeleton";
import DocUtilButtons from "@/components/dashboard/common/DocUtil";
import Pagination from "@/components/dashboard/common/Pagination";
import EmployeeTable from "@/components/dashboard/company/employee/molecules/EmployeeTable";
import EmployeeSearch from "@/components/dashboard/company/employee/molecules/EmployeeSearch";
import type { SearchValue } from "@/lib/types/search";

export default function EmployeeList({
  initialEmployees,
}: {
  initialEmployees: any;
}) {
  const [currentDateRange, setCurrentDateRange] = useState<DateRange>({
    startDate: subYears(startOfToday(), 1), // 1년 전 날짜
    endDate: startOfToday(),
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(initialEmployees?.maxPage ?? 1);
  const [employees, setEmployees] = useState(
    initialEmployees?.memberList ?? []
  );
  const [currentSearchValue, setCurrentSearchValue] = useState<SearchValue>({
    term: "",
    field: "all",
  });
  const isInitialMount = useRef(true);

  const formatDateToString = (date: Date | undefined) => {
    if (!date) return "";
    const koreaDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return koreaDate.toISOString().split("T")[0];
  };

  const loadEmployees = async () => {
    try {
      const res = await getData(
        `v1/manager/member/list?page=${currentPage}&search=${
          currentSearchValue.term
        }&filter=${currentSearchValue.field}&startDate=${formatDateToString(
          currentDateRange.startDate
        )}&endDate=${formatDateToString(currentDateRange.endDate)}`,
        true
      );

      if (res.resultCode === "OK" && res.data) {
        setEmployees(res.data.memberList);
        setMaxPage(res.data.maxPage);
      }
    } catch (error) {
      console.error("직원 목록 로딩 오류:", error);
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      loadEmployees();
    }
  }, [currentPage, currentDateRange, currentSearchValue]);

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
