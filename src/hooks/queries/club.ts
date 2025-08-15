import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clubService, type ClubNotice } from "@/api/services/club";

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
