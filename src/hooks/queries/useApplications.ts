import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import type { DateRange } from "@/components/dashboard/common/DateFilter";
import type { SearchValue } from "@/lib/types/search";
import type { ClubApplicationListResponse } from "@/api/types/company/club";

const formatDateToString = (date: Date | undefined) => {
  if (!date) return "";
  const koreaDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return koreaDate.toISOString().split("T")[0];
};

const fetchApplications = async ({ queryKey }: { queryKey: any }) => {
  const [_key, page, dateRange, search] = queryKey;
  const startDate = formatDateToString(dateRange.startDate);
  const endDate = formatDateToString(dateRange.endDate);

  // OpenAPI 스펙에 맞게 페이지를 0부터 시작하도록 수정
  const pageParam = Math.max(0, page - 1);

  const url = `v1/manager/club?page=${pageParam}&search=${search.term}&filter=${search.filter || "all"}&startDate=${startDate}&endDate=${endDate}`;

  // api.get을 사용하여 API 클라이언트의 에러 처리 활용
  const response = await api.get<{
    totalPages: number;
    currentPage: number;
    list: any[];
  }>(url);

  // 응답 구조를 기존 코드와 호환되도록 변환
  return {
    memberList: response.list,
    maxPage: response.totalPages,
    currentPage: response.currentPage,
  };
};

export const useApplications = (
  currentPage: number,
  currentDateRange: DateRange,
  searchValue: SearchValue
) => {
  return useQuery({
    queryKey: ["applications", currentPage, currentDateRange, searchValue],
    queryFn: fetchApplications,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
