import { getAccessToken, getClubId } from "@/lib/cookies";

export const deleteNotice = async (noticeId: number) => {
  const token = await getAccessToken();
  const clubId = await getClubId();
  if (!token) throw new Error("토큰 정보가 없습니다.");
  if (!clubId) throw new Error("클럽 정보가 없습니다.");

  const url = `/api/server/v1/executive/club/${clubId}/notices/${noticeId}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
  });
  // 백엔드 공통 래퍼를 그대로 반환
  return res.json();
};
