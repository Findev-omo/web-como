"use client";

import { useEffect, useState, useCallback } from "react";
import type { MemberListData } from "@/api/types/club/member";
import DocUtilButtons, {
  SaveButton,
} from "@/components/dashboard/common/DocUtil";
import Pagination from "@/components/dashboard/common/Pagination";
import MemberTable from "@/components/dashboard/club/member/molecules/MemberTable";
import MemberSearch from "./MemberSearch";
import { SearchValue } from "@/lib/types/search";
import { subYears, endOfToday, startOfToday } from "date-fns";
import { DateRange } from "@/components/dashboard/common/DateFilter";
import { useClubMembers } from "@/hooks/useClubMembers";

interface Props {
  clubId?: string;
}

export default function MemberList({ clubId }: Props) {
  const [currentDateRange, setCurrentDateRange] = useState<DateRange>({
    startDate: subYears(startOfToday(), 1), // 1년 전 날짜 시작
    endDate: endOfToday(), // 오늘의 끝까지 포함
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [currentSearchValue, setCurrentSearchValue] = useState<SearchValue>({
    term: "",
    field: "name",
  });
  const [members, setMembers] = useState<any[]>([]);

  const {
    members: hookMembers,
    downloadExcel,
    refetch,
  } = useClubMembers({
    searchTerm: currentSearchValue.term,
    dateRange: currentDateRange,
  });

  const formatDateToString = (date: Date | undefined) => {
    if (!date) return "";
    const koreaDate = new Date(date);
    return koreaDate.toISOString().split("T")[0];
  };

  const loadMembers = useCallback(
    async (searchValue: SearchValue = { term: "", field: "name" }) => {
      try {
        // Excel과 동일한 데이터 소스를 사용하여 화면 목록을 구성
        const response = await fetch(
          `/api/server/v1/executive/club/{clubId}/members/excel`,
          { headers: { "Content-Type": "application/json" } }
        );
        const result = await response.json();
        // Excel 응답 스펙: { data: [...], resultCode: 200 }
        const raw = Array.isArray(result?.data)
          ? result.data
          : (result?.data?.data ?? []);

        const allItems: any[] = Array.isArray(raw) ? raw : [];

        // 클라이언트 측 검색/기간 필터 적용 (엑셀과 동일 데이터 기준)
        const term = (searchValue.term ?? "").trim().toLowerCase();
        const start = currentDateRange.startDate;
        const end = currentDateRange.endDate;

        const toDate = (value: any): Date | null => {
          if (Array.isArray(value) && value.length >= 3) {
            const [y, m, d] = value;
            return new Date(Number(y), Number(m) - 1, Number(d));
          }
          if (typeof value === "string" && value) {
            const iso = value.includes("T") ? value.split("T")[0] : value;
            const dt = new Date(iso);
            return isNaN(dt.getTime()) ? null : dt;
          }
          return null;
        };

        const filtered = allItems.filter((item) => {
          const name: string = (item.name ?? "").toLowerCase();
          const dept: string = (item.department ?? "").toLowerCase();
          const textOk = term
            ? name.includes(term) || dept.includes(term)
            : true;
          const rd = toDate(item.requestDate ?? item.createdDate);
          const dateOk = rd
            ? (!start || rd >= new Date(start)) && (!end || rd <= new Date(end))
            : true;
          return textOk && dateOk;
        });

        // 테이블 요구 스키마로 정규화
        const normalized = filtered.map((item: any, idx: number) => ({
          id: item.id ?? idx + 1,
          name: item.name ?? "",
          department: item.department ?? "",
          position: item.position ?? "",
          // createdDate를 기본으로 사용하여 엑셀 데이터와 동일하게 표출
          requestDate: item.requestDate ?? item.createdDate ?? "",
          status: item.status ?? "",
        }));

        setMembers(normalized);
        setMaxPage(1);
      } catch (error) {
        console.error("동호회 회원 목록 로딩 오류:", error);
        setMembers([]);
        setMaxPage(1);
      }
    },
    [currentDateRange]
  );

  const handleExcelDownload = async () => {
    await downloadExcel();
  };

  useEffect(() => {
    setMembers(hookMembers);
  }, [hookMembers]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (searchValue: SearchValue) => {
    setCurrentSearchValue(searchValue);
    refetch();
  };

  return (
    <div className="space-y-10 p-8 rounded-xl bg-gray-0">
      <div className="space-y-6">
        <div className="flex justify-between">
          <h3 className="h2 font-semibold text-gray-900">{"동호회원 조회"}</h3>
          {/* <DocUtilButtons /> */}
          <SaveButton onClick={() => handleExcelDownload()} />
        </div>
        <MemberSearch onSearch={handleSearch} currentPage={currentPage} />
        <MemberTable data={members} />
        {members && members.length > 0 && (
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
// 동호회 임원 - 동호회 회원 목록 컴포넌트
