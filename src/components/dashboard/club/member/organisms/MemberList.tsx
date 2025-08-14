"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/api/action";
import type { MemberListData } from "@/api/types/club/member";
import DocUtilButtons, {
  SaveButton,
} from "@/components/dashboard/common/DocUtil";
import Pagination from "@/components/dashboard/common/Pagination";
import MemberTable from "@/components/dashboard/club/member/molecules/MemberTable";
import MemberSearch from "./MemberSearch";
import { SearchValue } from "@/lib/types/search";
import { subYears } from "date-fns";
import { startOfToday } from "date-fns";
import { DateRange } from "@/components/dashboard/common/DateFilter";

interface Props {
  clubId?: string;
}

export default function MemberList({ clubId }: Props) {
  // const { data } = useQuery({
  //   queryKey: ["club-manage-member", "list"],
  //   queryFn: () => getData("v2/club/web/member/", true).then((res) => res.data as MemberListData),
  // });

  const [currentDateRange, setCurrentDateRange] = useState<DateRange>({
    startDate: subYears(startOfToday(), 1), // 1년 전 날짜
    endDate: startOfToday(),
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [currentSearchValue, setCurrentSearchValue] = useState<SearchValue>({
    term: "",
    field: "name",
  });
  const [members, setMembers] = useState([]);
  const filteredMembers = useMemo(() => {
    const term = (currentSearchValue.term || "").trim().toLowerCase();
    if (!term) return members;
    return members.filter((m: any) => {
      const name = String(m?.name ?? "").toLowerCase();
      const dept = String(m?.department ?? "").toLowerCase();
      const role = String(
        (m as any)?.clubRole ?? m?.position ?? ""
      ).toLowerCase();
      return name.includes(term) || dept.includes(term) || role.includes(term);
    });
  }, [members, currentSearchValue]);

  const formatDateToString = (date: Date | undefined) => {
    if (!date) return "";
    const koreaDate = new Date(date);
    return koreaDate.toISOString().split("T")[0];
  };

  const { data: listResponse, isLoading } = useQuery({
    queryKey: ["clubMembers", clubId],
    queryFn: async () => {
      if (!clubId) return null as any;
      // 동호회 회원 목록 조회 (일반 사용자)
      const endpoint = `v1/club/member/list/${clubId}`;
      return getData(endpoint);
    },
    enabled: !!clubId,
    keepPreviousData: true,
  });

  useEffect(() => {
    const response = listResponse as any;
    if (!response || isLoading) {
      return;
    }
    const code = response?.resultCode as string | number | undefined;
    if (code === "OK" || code === 200 || code === "200") {
      const list = Array.isArray(response?.data)
        ? (response.data as any[])
        : Array.isArray(response?.data?.memberList)
          ? response.data.memberList
          : Array.isArray(response?.data?.list)
            ? response.data.list
            : [];
      setMembers(list);
      setMaxPage(1);
    } else {
      // 실패 시 기존 데이터 유지
    }
  }, [listResponse, isLoading]);

  const { refetch: getExcelData } = useQuery({
    queryKey: ["membersExcel", clubId, currentDateRange, currentSearchValue],
    queryFn: () => getData(`v1/executive/club/${clubId}/members/excel`),
    enabled: false,
  });

  const handleExcelDownload = async () => {
    const XLSX = await import("xlsx");
    try {
      const { data } = await getExcelData();
      const rows = Array.isArray(data?.data)
        ? data?.data
        : Array.isArray((data as any)?.data?.memberList)
          ? (data as any)?.data?.memberList
          : [];

      if (!Array.isArray(rows) || rows.length === 0) {
        console.error("엑셀 데이터가 없습니다.");
        return;
      }

      const toDateString = (value: any): string => {
        if (!value) return "";
        // 배열 형태 [yyyy, mm, dd]
        if (Array.isArray(value)) return value.slice(0, 3).join("-");
        // 문자열 형태 'yyyy-mm-dd...' 또는 ISO
        if (typeof value === "string") return value.slice(0, 10);
        return "";
      };

      const newData = rows.map(
        (
          item: {
            id?: number;
            name?: string;
            department?: string;
            position?: string;
            profileMessage?: string;
            createdDate?: string | any[];
            requestDate?: string | any[];
            status?: string;
          },
          idx: number
        ) => {
          const newItem: Record<string, any> = { ...item };

          const dateStr = toDateString(
            newItem.requestDate ?? newItem.createdDate
          );

          newItem.id = idx + 1;
          newItem["이름"] = newItem.name ?? "";
          newItem["부서"] = newItem.department ?? "";
          newItem["직급"] = newItem.position ?? "-";
          newItem["상태"] =
            newItem.status === "APPROVED" ? "활동중" : "비활동중";
          newItem["가입일"] = dateStr;

          delete newItem["name"];
          delete newItem["department"];
          delete newItem["position"];
          delete newItem["status"];
          delete newItem["requestDate"];
          delete newItem["createdDate"];

          return newItem;
        }
      );

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(newData);
      XLSX.utils.book_append_sheet(wb, ws, "Club Members");
      XLSX.writeFile(wb, "club_members.xlsx");
    } catch (error) {
      console.error("엑셀 다운로드 중 오류 발생:", error);
    }
  };

  // useQuery로 목록을 가져오므로 별도 초기 로딩 훅은 불필요

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (searchValue: SearchValue) => {
    setCurrentPage(1);
    setCurrentSearchValue(searchValue);
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
        <MemberTable data={filteredMembers} />
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
