import MemberTitle from "@/components/dashboard/club/member/molecules/MemberTitle";
import { getClubId } from "@/lib/cookies";
import dynamic from "next/dynamic";
import Skeleton from "@/components/common/Skeleton";

const MemberList = dynamic(
  () => import("@/components/dashboard/club/member/organisms/MemberList"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[700px]" />,
  }
);

export default async function ClubMemberPage() {
  const clubId = await getClubId();
  console.log(clubId);
  return (
    <>
      <MemberTitle />
      {/* <MemberSearch /> */}
      <MemberList clubId={clubId} />
    </>
  );
}
// 동호회 임원 - 동호회 회원 관리 페이지
