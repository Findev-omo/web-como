import { useQuery } from "@tanstack/react-query";
import { getReports } from "@/api/actions/company/report/getReports";
import type { DateRange } from "@/components/dashboard/common/DateFilter";
import { formatDate } from "@/lib/format";

const fetchCompanyReports = async ({ queryKey }: { queryKey: any }) => {
  const [_key, page, dateRange] = queryKey;
  const startDate = formatDate(dateRange.startDate);
  const endDate = formatDate(dateRange.endDate);
  const response = await getReports(page, startDate, endDate);
  return response;
};

export const useCompanyReports = (
  currentPage: number,
  currentDateRange: DateRange,
  initialData: { list: any[]; maxPage: number }
) => {
  return useQuery({
    queryKey: ["companyReports", currentPage, currentDateRange],
    queryFn: fetchCompanyReports,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    initialData: {
      list: initialData.list,
      maxPage: initialData.maxPage,
    },
  });
};
