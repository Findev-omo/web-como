import { useQuery } from "@tanstack/react-query";
import { getExpense } from "@/api/actions/company/expense/getExpense";
import type { DateRange } from "@/components/dashboard/common/DateFilter";
import { formatDate } from "@/lib/format";

const fetchCompanyExpenses = async ({ queryKey }: { queryKey: any }) => {
  const [_key, page, dateRange] = queryKey;
  const startDate = formatDate(dateRange.startDate);
  const endDate = formatDate(dateRange.endDate);
  const response = await getExpense(page, startDate, endDate);
  // getExpense 액션은 이미 내부적으로 에러 처리를 하고 있을 수 있으므로,
  // 여기서는 성공적으로 데이터를 반환하는 것에 집중합니다.
  // 만약 getExpense가 실패 시 특정 값을 반환한다면, 그에 맞춰 에러를 throw할 수 있습니다.
  return response;
};

export const useCompanyExpenses = (
  currentPage: number,
  currentDateRange: DateRange,
  initialData: { list: any[]; maxPage: number }
) => {
  return useQuery({
    queryKey: ["companyExpenses", currentPage, currentDateRange],
    queryFn: fetchCompanyExpenses,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    initialData: {
      list: initialData.list,
      maxPage: initialData.maxPage,
    },
  });
};
