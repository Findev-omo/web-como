"use client";

import { useState, useEffect } from "react";
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

import type { Employee } from "@/api/types/company/employee";

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
  const [maxPage, setMaxPage] = useState(1);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // 초기 데이터 설정
  useEffect(() => {
    if (initialEmployees && initialEmployees.length > 0) {
      setEmployees(initialEmployees);
    }
  }, [initialEmployees]);

  const [currentSearchValue, setCurrentSearchValue] = useState<SearchValue>({
    term: "",
    field: "all",
  });

  console.log("Initial employees:", initialEmployees);
  console.log("Current employees state:", employees);
  console.log("Current search value:", currentSearchValue);

  const formatDateToString = (date: Date | undefined) => {
    if (!date) return "";
    const koreaDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return koreaDate.toISOString().split("T")[0];
  };

  const loadEmployees = async () => {
    try {
      const url = `v1/manager/member/list?page=${currentPage}&search=${
        currentSearchValue.term
      }&filter=${currentSearchValue.field}&startDate=${formatDateToString(
        currentDateRange.startDate
      )}&endDate=${formatDateToString(currentDateRange.endDate)}`;

      console.log("API 호출 URL:", url);
      console.log("검색 조건:", {
        page: currentPage,
        search: currentSearchValue.term,
        filter: currentSearchValue.field,
        startDate: formatDateToString(currentDateRange.startDate),
        endDate: formatDateToString(currentDateRange.endDate),
      });

      const res = await getData(url, true);

      if (String(res.resultCode) === "200" && res.data) {
        console.log("Employee list loaded:", res.data);
        console.log("API 응답 전체:", res);
        setEmployees(res.data.list);
        setMaxPage(res.data.totalPages);
      } else {
        console.log("API 응답 에러:", res);
      }
    } catch (error) {
      console.error("직원 목록 로딩 오류:", error);
    }
  };

  // 검색, 날짜, 페이지 변경 시 API 호출
  useEffect(() => {
    // 검색이나 필터가 변경된 경우에만 API 호출
    if (currentSearchValue.term !== "" || currentSearchValue.field !== "all") {
      loadEmployees();
    }
  }, [currentSearchValue]);

  // 날짜 변경 시 API 호출
  useEffect(() => {
    loadEmployees();
  }, [currentDateRange]);

  // 페이지 변경 시 API 호출
  useEffect(() => {
    if (currentPage !== 1) {
      loadEmployees();
    }
  }, [currentPage]);

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
