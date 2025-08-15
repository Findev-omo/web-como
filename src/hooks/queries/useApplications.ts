import { useQuery } from "@tanstack/react-query";
import { getData } from "@/api/action";
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
  const response = (await getData(
    url
  )) as unknown as ClubApplicationListResponse;

  // OpenAPI 스펙에 맞게 응답 코드 체크 수정
  if (response.resultCode !== 200) {
    throw new Error(
      `동호회 신청 목록을 불러오는데 실패했습니다: ${response.resultMessage}`
    );
  }

  // 응답 구조를 기존 코드와 호환되도록 변환
  return {
    memberList: response.data.list,
    maxPage: response.data.totalPages,
    currentPage: response.data.currentPage,
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
