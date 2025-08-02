import { clubService } from "@/api/services/club";

export const getNotices = async (page?: number, search?: string) => {
  return clubService.notices.getList(page || 1, search || "");
};
