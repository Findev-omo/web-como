import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clubService, type ClubNotice } from "@/api/services/club";
import apiClient from "@/lib/axios";

// Query Keys
export const clubKeys = {
  all: ["club"] as const,
  notices: () => [...clubKeys.all, "notices"] as const,
  noticesList: (page: number, search: string) =>
    [...clubKeys.notices(), "list", page, search] as const,
  noticeDetail: (id: number) => [...clubKeys.notices(), "detail", id] as const,
};

// Notice Hooks
export const useClubNotices = (
  page: number = 1,
  search: string = "",
  initialData?: { list: ClubNotice[]; totalPages: number }
) => {
  return useQuery({
    queryKey: clubKeys.noticesList(page, search),
    queryFn: () => clubService.notices.getList(page, search),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    ...(initialData && { initialData }),
  });
};

export const useClubNoticeDetail = (noticeId: number) => {
  return useQuery({
    queryKey: clubKeys.noticeDetail(noticeId),
    queryFn: () => clubService.notices.getDetail(noticeId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Notice Mutations
export const useCreateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clubService.notices.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clubKeys.notices() });
    },
  });
};

export const useUpdateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      noticeId,
      data,
    }: {
      noticeId: number;
      data: Partial<ClubNotice>;
    }) => clubService.notices.update(noticeId, data),
    onSuccess: (_, { noticeId }) => {
      queryClient.invalidateQueries({ queryKey: clubKeys.notices() });
      queryClient.invalidateQueries({
        queryKey: clubKeys.noticeDetail(noticeId),
      });
    },
  });
};

export const useDeleteNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clubService.notices.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clubKeys.notices() });
    },
  });
};

export const usePinNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clubService.notices.pin,
    onSuccess: (_, noticeId) => {
      queryClient.invalidateQueries({ queryKey: clubKeys.notices() });
      queryClient.invalidateQueries({
        queryKey: clubKeys.noticeDetail(noticeId),
      });
    },
  });
};

export const useUnpinNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clubService.notices.unpin,
    onSuccess: (_, noticeId) => {
      queryClient.invalidateQueries({ queryKey: clubKeys.notices() });
      queryClient.invalidateQueries({
        queryKey: clubKeys.noticeDetail(noticeId),
      });
    },
  });
};

// 동호회 타입 정의
export interface Club {
  id: number;
  name: string;
  intro: string;
  createdAt: string;
  longitude: string;
  latitude: string;
  location: string;
  activityPlan: string;
  goal: string;
  headId: number;
  headName: string;
  headDepartment: string;
  subHeadId: number;
  subHeadName: string;
  subHeadDepartment: string;
  affairsId: number;
  affairsName: string;
  affairsDepartment: string;
  clubCategory: string;
  maxMemberCount: number;
  minMemberCount: number;
  duesPerYear: number;
  detail: string;
  clubImage: string;
  bankbookImage: string;
  isJoined: boolean;
}

// API 응답 타입
interface ClubResponse {
  data: Club[];
  resultCode: string;
  resultMessage: string;
}

// 가입된 동호회 조회 훅
export const useMyClubs = () => {
  return useQuery<ClubResponse>({
    queryKey: ["myClubs"],
    queryFn: async () => {
      // 현재 로그인한 사용자가 가입한 동호회 조회
      const response = await apiClient.get("/v1/club/my");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};
