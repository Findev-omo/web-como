import { useQuery } from "@tanstack/react-query";
import { getData } from "@/api/action";
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
  const url = `v1/manager/club/manage-list?page=${page}&search=${search.term}&filter=${search.field}&startDate=${startDate}&endDate=${endDate}`;
  const response = await getData(url, true);
  if (response.resultCode !== "OK") {
    throw new Error(
      `사내 동호회 목록을 불러오는데 실패했습니다: ${response.resultMessage}`
    );
  }
  return response.data;
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
