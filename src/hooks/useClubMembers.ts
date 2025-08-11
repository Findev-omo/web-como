"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { DateRange } from "@/components/dashboard/common/DateFilter";

export interface ClubMemberRow {
  id: number;
  name: string;
  department: string;
  position: string;
  requestDate: string | any[];
  status: string;
}

export interface UseClubMembersParams {
  searchTerm: string;
  dateRange: DateRange;
}

export interface UseClubMembersResult {
  members: ClubMemberRow[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  downloadExcel: () => Promise<void>;
}

function toDate(value: any): Date | null {
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
}

export function useClubMembers(
  params: UseClubMembersParams
): UseClubMembersResult {
  const { searchTerm, dateRange } = params;
  const [members, setMembers] = useState<ClubMemberRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/server/v1/executive/club/{clubId}/members/excel`,
        { headers: { "Content-Type": "application/json" } }
      );
      const result = await response.json();
      const raw = Array.isArray(result?.data)
        ? result.data
        : (result?.data?.data ?? []);

      const allItems: any[] = Array.isArray(raw) ? raw : [];

      const term = (searchTerm ?? "").trim().toLowerCase();
      const start = dateRange.startDate;
      const end = dateRange.endDate;

      const filtered = allItems.filter((item) => {
        const name: string = (item.name ?? "").toLowerCase();
        const dept: string = (item.department ?? "").toLowerCase();
        const textOk = term ? name.includes(term) || dept.includes(term) : true;
        const rd = toDate(item.requestDate ?? item.createdDate);
        const dateOk = rd
          ? (!start || rd >= new Date(start)) && (!end || rd <= new Date(end))
          : true;
        return textOk && dateOk;
      });

      const normalized: ClubMemberRow[] = filtered.map(
        (item: any, idx: number) => ({
          id: item.id ?? idx + 1,
          name: item.name ?? "",
          department: item.department ?? "",
          position: item.position ?? "",
          requestDate: item.requestDate ?? item.createdDate ?? "",
          status: item.status ?? "",
        })
      );

      setMembers(normalized);
    } catch (err: any) {
      setError(err?.message || "회원 목록 조회에 실패했습니다.");
      setMembers([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, dateRange]);

  const refetch = useCallback(async () => {
    await fetchMembers();
  }, [fetchMembers]);

  const downloadExcel = useCallback(async () => {
    const XLSX = await import("xlsx");
    try {
      const response = await fetch(
        `/api/server/v1/executive/club/{clubId}/members/excel`,
        { headers: { "Content-Type": "application/json" } }
      );
      const result = await response.json();
      const raw = Array.isArray(result?.data)
        ? result.data
        : (result?.data?.data ?? []);

      if (!Array.isArray(raw)) return;

      const newData = raw.map(
        (
          item: {
            id: number;
            name: string;
            department: string;
            profileMessage: string;
            createdDate: string;
            status: string;
            position?: string;
            requestDate?: any;
          },
          idx: number
        ) => {
          const newItem: Record<string, any> = { ...item };
          const date = Array.isArray(newItem.requestDate)
            ? newItem.requestDate.slice(0, 3).join("-")
            : ((newItem.createdDate ?? "").split("T")[0] ?? "");

          newItem.id = idx + 1;
          newItem["이름"] = newItem.name;
          newItem["부서"] = newItem.department;
          newItem["직급"] = newItem.position;
          newItem["상태"] =
            newItem.status === "APPROVED" ? "활동중" : "비활동중";
          newItem["가입일"] = date;

          delete newItem["name"];
          delete newItem["department"];
          delete newItem["position"];
          delete newItem["status"];
          delete newItem["requestDate"];

          return newItem;
        }
      );

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(newData);
      XLSX.utils.book_append_sheet(wb, ws, "Club Members");
      XLSX.writeFile(wb, "club_members.xlsx");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("엑셀 다운로드 중 오류 발생:", error);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { members, isLoading, error, refetch, downloadExcel };
}

export default useClubMembers;
