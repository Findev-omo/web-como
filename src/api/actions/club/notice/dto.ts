import { ClubNotice, NoticeResponse } from "@/api/services/club";

export const toClubNotice = (
  dto: NoticeResponse
): { list: ClubNotice[]; maxPage: number } => {
  return {
    list: dto.list.map((notice) => {
      return {
        id: notice.id,
        title: notice.title,
        author: notice.writerName,
        createdAt: new Date(notice.createdDate).toISOString(),
        viewCount: notice.viewCount,
        isPinned: notice.isPinned === "Y",
      };
    }),
    maxPage: dto.totalPages,
  };
};
