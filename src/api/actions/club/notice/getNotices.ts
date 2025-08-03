import { clubApi } from "@/api/client";
import { ClubNotice, NoticeResponse } from "@/api/services/club";
import { toClubNotice } from "./dto";

export const getNotices = async (
  page: number,
  search: string
): Promise<{ list: ClubNotice[]; maxPage: number }> => {
  const response = await clubApi.get<NoticeResponse>(
    "/executive/club/{clubId}/notices",
    {
      page,
      search,
    }
  );
  return toClubNotice(response);
};
