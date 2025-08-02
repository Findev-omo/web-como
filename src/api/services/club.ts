import { clubApi } from "../client";
import type { PaginatedResponse, BaseEntity } from "../types/common";

// 타입 정의
export interface ClubNotice extends BaseEntity {
  title: string;
  content: string;
  author: string;
  createdAt: string;
  isPinned: boolean;
  viewCount: number;
}

// Club API 서비스
export const clubService = {
  // 공지사항 관리
  notices: {
    getList: (page: number = 1, search: string = "") =>
      clubApi.get<PaginatedResponse<ClubNotice>>(
        `/v1/executive/club/{clubId}/notices?page=${page}&search=${search}`
      ),

    getDetail: (noticeId: number) =>
      clubApi.get<ClubNotice>(
        `/v1/executive/club/{clubId}/notices/${noticeId}`
      ),

    create: (
      data: Omit<ClubNotice, "id" | "author" | "createdAt" | "viewCount">
    ) => clubApi.post<ClubNotice>(`/v1/executive/club/{clubId}/notices`, data),

    update: (noticeId: number, data: Partial<ClubNotice>) =>
      clubApi.put<ClubNotice>(
        `/v1/executive/club/{clubId}/notices/${noticeId}`,
        data
      ),

    delete: (noticeId: number) =>
      clubApi.delete<void>(`/v1/executive/club/{clubId}/notices/${noticeId}`),

    pin: (noticeId: number) =>
      clubApi.patch<void>(
        `/v1/executive/club/{clubId}/notices/${noticeId}/pin`
      ),

    unpin: (noticeId: number) =>
      clubApi.patch<void>(
        `/v1/executive/club/{clubId}/notices/${noticeId}/unpin`
      ),
  },
};
