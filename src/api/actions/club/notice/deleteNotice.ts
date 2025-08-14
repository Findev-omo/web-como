import { clubService } from "@/api/services/club";

export const deleteNotice = async (noticeId: number) => {
  return clubService.notices.delete(noticeId);
};
