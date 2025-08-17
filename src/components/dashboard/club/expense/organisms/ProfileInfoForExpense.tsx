import { Calendar, People } from "@/assets/icons/info";
import { formatDate } from "@/lib/utils";

export default function ProfileInfoForExpense({
  activityPlan,
  memberCount,
  createdAt,
}: {
  activityPlan: string;
  memberCount: number;
  createdAt: string; // ISO 8601 형식의 문자열
}) {
  const formatCreatedAt = (createdAt: string) => {
    try {
      const date = new Date(createdAt);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}.${month}.${day}`;
    } catch (error) {
      console.error("날짜 파싱 에러:", error);
      return createdAt; // 파싱 실패 시 원본 문자열 반환
    }
  };
  return (
    <div className="flex items-center gap-2 body-1 font-medium text-gray-500">
      <span>{`개설일자 ${formatCreatedAt(createdAt)}`}</span>
      <div className="flex items-center gap-0.5">
        <People className="w-5 h-5 text-gray-500" />
        {memberCount}
      </div>
      <div className="flex items-center gap-0.5">
        <Calendar className="w-[18px] h-[18px] text-gray-500" />
        {activityPlan}
      </div>
    </div>
  );
}
