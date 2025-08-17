import ClubCard from "@/components/dashboard/company/employee/molecules/ClubCard";
import { useMyClubs } from "@/hooks/queries/club";

export default function JoinedClub({ memberId }: { memberId: string }) {
  console.log("memberId", memberId);

  // 현재 사용자의 역할 확인
  const getCookie = (name: string) => {
    if (typeof window === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
  };

  const role = getCookie("role");
  console.log("현재 사용자 역할:", role);

  const { data, isLoading, error } = useMyClubs(memberId);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="space-y-6 p-8 rounded-xl bg-gray-0">
        <h3 className="h2 font-bold text-gray-900">{"가입한 동호회"}</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">로딩 중...</span>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    console.error("동호회 데이터 로딩 오류:", error);
    return (
      <div className="space-y-6 p-8 rounded-xl bg-gray-0">
        <h3 className="h2 font-bold text-gray-900">{"가입한 동호회"}</h3>
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">가입 중인 동호회가 없습니다.</p>
          <p className="text-sm text-gray-400 mt-2">
            (API 오류로 인해 임시 표시)
          </p>
        </div>
      </div>
    );
  }

  // 데이터가 없거나 API 에러인 경우
  if (!data || data.resultCode !== "200") {
    return (
      <div className="space-y-6 p-8 rounded-xl bg-gray-0">
        <h3 className="h2 font-bold text-gray-900">{"가입한 동호회"}</h3>
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">가입 중인 동호회가 없습니다.</p>
        </div>
      </div>
    );
  }

  const clubs = data.data || [];

  return (
    <div className="space-y-6 p-8 rounded-xl bg-gray-0">
      <h3 className="h2 font-bold text-gray-900">{"가입한 동호회"}</h3>
      <ul className="flex flex-wrap gap-5">
        {clubs.length === 0 ? (
          <p className="text-lg text-gray-500">가입 중인 동호회가 없습니다.</p>
        ) : (
          clubs.map((club) => <ClubCard key={club.id} club={club} />)
        )}
      </ul>
    </div>
  );
}
