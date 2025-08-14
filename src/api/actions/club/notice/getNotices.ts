import { getAccessToken, getClubId } from "@/lib/cookies";
import { ClubNotice, NoticeResponse } from "@/api/services/club";
import { toClubNotice } from "./dto";

export const getNotices = async (
  page: number,
  search: string
): Promise<{ list: ClubNotice[]; maxPage: number }> => {
  const token = await getAccessToken();
  const clubId = await getClubId();

  if (!token) throw new Error("토큰 정보가 없습니다.");
  if (!clubId) throw new Error("클럽 정보가 없습니다.");

  const url = `/api/server/v1/executive/club/${clubId}/notices?page=${page}&search=${search}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  // API 응답 구조 확인 및 안전한 처리
  if (data.data && data.data.noticeList) {
    // 실제 API 응답 구조에 맞게 변환
    const noticeResponse: NoticeResponse = {
      list: data.data.noticeList,
      currentPage: data.data.currentPage,
      totalPages: data.data.maxPage,
    };
    return toClubNotice(noticeResponse);
  } else if (data.list) {
    // 원래 예상 구조
    return toClubNotice(data);
  } else {
    // 응답 구조가 예상과 다른 경우 빈 결과 반환
    console.error("Unexpected API response structure:", data);
    return { list: [], maxPage: 0 };
  }
};
