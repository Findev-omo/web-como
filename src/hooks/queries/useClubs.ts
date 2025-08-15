import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import type { DateRange } from "@/components/dashboard/common/DateFilter";
import type { SearchValue } from "@/lib/types/search";

const formatDateToString = (date: Date | undefined) => {
  if (!date) return "";
  const koreaDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return koreaDate.toISOString().split("T")[0];
};

const fetchClubs = async ({ queryKey }: { queryKey: any }) => {
  const [_key, page, dateRange, search] = queryKey;
  const startDate = formatDateToString(dateRange.startDate);
  const endDate = formatDateToString(dateRange.endDate);

  // OpenAPI 스펙에 맞게 페이지를 0부터 시작하도록 수정
  const pageParam = Math.max(0, page - 1);

  const url = `v1/manager/club?page=${pageParam}&search=${search.term}&filter=${search.field}&startDate=${startDate}&endDate=${endDate}`;
  return api.get(url);
};

export const useClubs = (
  currentPage: number,
  currentDateRange: DateRange,
  searchValue: SearchValue
) => {
  return useQuery({
    queryKey: ["clubs", currentPage, currentDateRange, searchValue],
    queryFn: fetchClubs,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
