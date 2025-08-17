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
export const useMyClubs = (memberId?: string) => {
  return useQuery<ClubResponse>({
    queryKey: ["myClubs", memberId],
    queryFn: async () => {
      if (memberId) {
        // 특정 임직원의 동호회 조회 (관리자용)
        try {
          console.log(`API 호출 시도: /v1/manager/member/${memberId}/clubs`);
          const response = await apiClient.get(
            `/v1/manager/member/${memberId}/clubs`
          );
          console.log("API 호출 성공:", response.data);
          return response.data;
        } catch (error) {
          console.error("v1/manager/member/{id}/clubs API 에러:", error);
          console.error("에러 상세:", error.response?.data);

          // 대체 API 시도
          try {
            console.log(`대체 API 호출: /v1/manager/member/${memberId}`);
            const response = await apiClient.get(
              `/v1/manager/member/${memberId}`
            );
            console.log("대체 API 응답:", response.data);

            // joinedClub 정보가 있으면 사용
            if (response.data.data?.joinedClub) {
              const clubs = Array.isArray(response.data.data.joinedClub)
                ? response.data.data.joinedClub
                : [response.data.data.joinedClub];
              console.log("추출된 동호회 목록:", clubs);
              return {
                data: clubs,
                resultCode: response.data.resultCode,
                resultMessage: response.data.resultMessage,
              };
            }

            console.log("joinedClub이 null이므로 빈 배열 반환");
            return {
              data: [],
              resultCode: "200",
              resultMessage: "가입한 동호회가 없습니다.",
            };
          } catch (fallbackError) {
            console.error("대체 API도 실패:", fallbackError);
            console.error("대체 API 에러 상세:", fallbackError.response?.data);
            throw error; // 원래 에러를 다시 던짐
          }
        }
      } else {
        // 현재 로그인한 사용자의 동호회 조회 (일반 사용자용)
        const response = await apiClient.get("/v1/club/my");
        return response.data;
      }
    },
    enabled: true, // 항상 실행
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};
