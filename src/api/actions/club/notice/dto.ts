import { ClubNotice, NoticeResponse } from "@/api/services/club";

export const toClubNotice = (
  dto: NoticeResponse
): { list: ClubNotice[]; maxPage: number } => {
  // 안전한 처리: dto.list가 배열인지 확인
  if (!dto || !Array.isArray(dto.list)) {
    console.error("Invalid dto structure:", dto);
    return { list: [], maxPage: 0 };
  }

  return {
    list: dto.list.map((notice) => {
      // 안전한 날짜 처리
      let createdAt: string;
      try {
        if (Array.isArray(notice.createdDate)) {
          // createdDate가 배열인 경우 (예: [2024, 1, 15, 10, 30, 0])
          const [year, month, day, hour = 0, minute = 0, second = 0] =
            notice.createdDate;
          const date = new Date(year, month - 1, day, hour, minute, second);
          createdAt = date.toISOString();
        } else if (typeof notice.createdDate === "string") {
          // 문자열인 경우
          const date = new Date(notice.createdDate);
          if (isNaN(date.getTime())) {
            console.warn("Invalid date string:", notice.createdDate);
            createdAt = new Date().toISOString(); // 현재 시간으로 fallback
          } else {
            createdAt = date.toISOString();
          }
        } else if (typeof notice.createdDate === "number") {
          // 타임스탬프인 경우
          createdAt = new Date(notice.createdDate).toISOString();
        } else {
          console.warn("Unknown date format:", notice.createdDate);
          createdAt = new Date().toISOString(); // 현재 시간으로 fallback
        }
      } catch (error) {
        console.error("Date parsing error:", error, notice.createdDate);
        createdAt = new Date().toISOString(); // 현재 시간으로 fallback
      }

      return {
        id: notice.noticeId,
        title: notice.title,
        author: notice.name,
        createdAt,
        viewCount: notice.viewCount,
        isPinned: notice.isPinned === "Y",
      };
    }),
    maxPage: dto.totalPages || 0,
  };
};
