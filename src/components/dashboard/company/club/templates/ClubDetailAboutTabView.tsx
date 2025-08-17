"use client";

import Skeleton from "@/components/common/Skeleton";
import dynamic from "next/dynamic";
import ClubDetailInfo from "@/components/dashboard/company/club/organisms/ClubDetailInfo";
import { useParams } from "next/navigation";

const ClubMemberList = dynamic(
  () => import("@/components/dashboard/company/club/organisms/ClubMemberList"),
  { ssr: false, loading: () => <Skeleton className="h-[400px]" /> }
);

export default function ClubDetailAboutTabView() {
  const params = useParams();
  const clubId = params.id as string;

  return (
    <div className="flex flex-col gap-8">
      <ClubDetailInfo />
      <ClubMemberList clubId={clubId} />
    </div>
  );
}
