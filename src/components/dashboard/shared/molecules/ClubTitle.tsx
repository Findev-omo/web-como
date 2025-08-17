"use client";

import Chip from "@/components/common/Chip";
import ClubProfileInfo from "@/components/dashboard/club/common/ClubProfileInfo";
import useClubDetailStore from "@/lib/store/clubDetailStore";

const categoryMapping = {
  ART_CULTURE: "문화/예술",
  ACTIVITY: "액티비티",
  CREATIVE: "크리에이티브",
  FOODBEVERAGE: "F&B",
  NETWORKING: "네트워킹",
  STUDY: "스터디",
  ETC: "기타",
};

export default function ClubTitle() {
  const { clubDetail } = useClubDetailStore();

  if (!clubDetail) {
    return (
      <div className="flex items-center gap-3 p-[38px] rounded-2xl bg-gray-0">
        <h2 className="font-semibold text-gray-900">로딩 중...</h2>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-[38px] rounded-2xl bg-gray-0">
      <h2 className="font-semibold text-gray-900">{clubDetail.clubName}</h2>
      <Chip
        content={
          categoryMapping[
            clubDetail.category as keyof typeof categoryMapping
          ] || clubDetail.category
        }
        primary
      />
    </div>
  );
}
