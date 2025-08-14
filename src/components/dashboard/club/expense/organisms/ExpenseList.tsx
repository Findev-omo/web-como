"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getData } from "@/api/action";
import type { ExpenseListData } from "@/api/types/club/activityExpenses/paymentHistory";
import DateFilter, {
  type DateRange,
} from "@/components/dashboard/common/DateFilter";
import Pagination from "@/components/dashboard/common/Pagination";
import ExpenseTable from "@/components/dashboard/club/expense/molecules/ExpenseTable";
import ExpenseTableSkeleton from "@/components/dashboard/club/expense/molecules/ExpenseTableSkeleton";
import { Plus } from "@/assets/icons/action";

interface Props {
  clubId?: string;
}

export default function ExpenseList({ clubId }: Props) {
  const pathname = usePathname();
  const { push } = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data, isLoading, fetchNextPage, fetchPreviousPage } =
    useInfiniteQuery({
      queryKey: [clubId, "expense"],
      queryFn: ({ pageParam }) =>
        getData(
          `v1/executive/club/${clubId}/activity-expenses?page=${Math.max(
            0,
            (pageParam as number) - 1
          )}`,
          false,
          undefined,
          { cache: "no-store", revalidate: 0 }
        ),
      getNextPageParam: (lastPage, allPages) => {
        const totalPages = Number(lastPage?.data?.totalPages) || 0;
        const loadedPages = allPages.length; // 1-based UI 페이지 수
        return loadedPages < totalPages ? loadedPages + 1 : undefined;
      },
      getPreviousPageParam: (_firstPage, allPages) => {
        const loadedPages = allPages.length;
        return loadedPages > 1 ? loadedPages - 1 : undefined;
      },
      initialPageParam: 1,
    });

  const [currentPage, setCurrentPage] = useState<number>(1);

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      if (page > currentPage) {
        fetchNextPage();
      } else {
        fetchPreviousPage();
      }
    }
  };

  const maxPage = data?.pages[0].data.totalPages;

  return (
    <div className="space-y-6 p-8 rounded-xl bg-gray-0">
      <div className="flex justify-between">
        <h3 className="h2 font-semibold text-gray-900">
          {"활동지원비 지급 내역 조회"}
        </h3>
        {pathname.startsWith("/club") && (
          <button
            className="flex items-center gap-[3px] py-1 px-3 rounded body-1 font-medium text-gray-50 bg-gray-900 cursor-pointer"
            onClick={() => push(`${pathname}/new`)}
          >
            {"활동지원비 신청"}
            <Plus className="w-5 h-5 text-gray-50" />
          </button>
        )}
      </div>
      <div className="space-y-4">
        {/* <DateFilter
          currentDateRange={currentDateRange}
          handleDateRangeChange={handleDateRangeChange}
        /> */}
        <div className="space-y-10">
          {!isClient ? (
            <ExpenseTableSkeleton />
          ) : (
            <ExpenseTable data={data?.pages} currentPage={currentPage} />
          )}

          <Pagination
            currentPage={currentPage}
            maxPage={maxPage}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
