"use client";

import { useQuery } from "@tanstack/react-query";
import { getData } from "@/api/action";

export interface UserSearchItem {
  id: number;
  name: string;
  nickname?: string;
  companyName?: string;
  profileMessage?: string | null;
  profileImage?: string | null;
  Department?: string;
  position?: string;
}

export const useMemberSearch = (query: string) => {
  return useQuery({
    queryKey: ["memberSearch", query],
    queryFn: async () => {
      const endpoint = `member/search${query ? `?query=${encodeURIComponent(query)}` : ""}`;
      const res = await getData(endpoint);
      // 성공 코드 허용: OK | 200 | "200"
      const code = res?.resultCode as string | number | undefined;
      if (code === "OK" || code === 200 || code === "200") {
        return Array.isArray(res?.data) ? (res.data as UserSearchItem[]) : [];
      }
      return [] as UserSearchItem[];
    },
    enabled: query.trim().length > 0,
  });
};
