import { getAccessToken, getClubId } from "@/lib/cookies";

export const getNoticeDetail = async (noticeId: number) => {
  const token = await getAccessToken();
  const clubId = await getClubId();
  if (!token) throw new Error("토큰 정보가 없습니다.");
  if (!clubId) throw new Error("클럽 정보가 없습니다.");
  const url = `/api/server/v1/executive/club/${clubId}/notices/${noticeId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
  });
  if (!response.ok) {
    const err: any = new Error("Failed to fetch notice detail");
    err.status = response.status;
    throw err;
  }
  const data = await response.json();
  // 공통 래퍼 { data, resultCode, ... }
  const payload = data?.data ?? data ?? {};
  const created = payload.createdDate;
  let createdDate: number[] = [];
  if (Array.isArray(created) && created.length >= 3) {
    createdDate = [Number(created[0]), Number(created[1]), Number(created[2])];
  } else if (typeof created === "string" && created) {
    const [y, m, d] = created.split("T")[0].split("-");
    createdDate = [Number(y), Number(m), Number(d)];
  } else if (typeof created === "number") {
    const dt = new Date(created);
    createdDate = [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()];
  }

  return {
    id: payload.id ?? payload.noticeId,
    title: payload.title ?? "",
    content: payload.content ?? "",
    writerName: payload.writerName ?? payload.name ?? "",
    createdDate,
    viewCount: Number(payload.viewCount ?? 0),
    photos: Array.isArray(payload.photos)
      ? payload.photos
      : Array.isArray(payload.images)
        ? payload.images
        : [],
    isPinned: payload.isPinned,
  };
};
