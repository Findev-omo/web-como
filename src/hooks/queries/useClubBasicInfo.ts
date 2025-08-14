import { useQuery } from "@tanstack/react-query";
import { getData } from "@/api/action";

export interface ClubBasicInfoResponse {
  companyName?: string;
  name?: string;
  clubName?: string;
  clubCategory?: string;
  category?: string;
  goal?: string;
  intro?: string;
  detail?: string;
}

export const useClubBasicInfo = (clubId: string | null) => {
  return useQuery<ClubBasicInfoResponse>({
    queryKey: ["club", "basic", clubId],
    enabled: !!clubId,
    queryFn: async () => {
      const res = await getData(`v1/club/${clubId}`);
      return res.data as ClubBasicInfoResponse;
    },
    staleTime: 60_000,
    gcTime: 300_000,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
