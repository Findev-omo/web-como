"use client";

import ActivitySchedule from "../atoms/ActivitySchedule";
import PlaceSearchWithNaverMap from "../organisms/PlaceSearchWithNaverMap";
import { ClubIndexSchemaType } from "@/lib/types/schema";
import { useQuery } from "@tanstack/react-query";

// 활동 정보
export default function ClubActivityInfo({
  clubId,
}: {
  clubId: string | null;
}) {
  console.log(" ClubActivityInfo에서 clubId", clubId);

  const { data } = useQuery({
    queryKey: ["club", "detail", clubId],
    queryFn: async () => {
      if (!clubId) throw new Error("NO_CLUB");
      const r = await fetch(`/api/server/v1/club/${clubId}`, {
        headers: { accept: "application/json" },
      });
      const b = await r.json();
      return b?.data ?? b;
    },
    enabled: !!clubId,
    staleTime: 60_000,
    gcTime: 300_000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const location = data?.location ?? "";
  console.log("location", location);

  return (
    <div className="space-y-6 rounded-xl bg-gray-0 p-8">
      <h2 className="font-bold text-gray-900">활동 정보</h2>
      <ActivitySchedule />
      <div></div>
      {location ? (
        <PlaceSearchWithNaverMap<ClubIndexSchemaType>
          roadAddressDefaultValue={location}
        />
      ) : (
        <div className="text-gray-500 body-2">
          {"클럽 위치 정보가 없습니다."}
        </div>
      )}
    </div>
  );
}
