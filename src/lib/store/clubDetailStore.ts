import { create } from "zustand";

interface ClubDetailData {
  clubId: number;
  clubName: string;
  companyName: string;
  category: string;
  intro: string;
  detail: string;
  goal: string;
  location: string;
  activityPlan: string;
  clubImage: string;
  headId: number;
  headName: string;
  headDepartment: string;
  deputyId: number;
  deputyName: string;
  deputyDepartment: string;
  affairsId: number;
  affairsName: string;
  affairsDepartment: string;
}

interface ClubDetailState {
  clubDetail: ClubDetailData | null;
  isLoading: boolean;
  setClubDetail: (detail: ClubDetailData) => void;
  setLoading: (loading: boolean) => void;
  clearClubDetail: () => void;
}

const useClubDetailStore = create<ClubDetailState>((set) => ({
  clubDetail: null,
  isLoading: false,
  setClubDetail: (detail: ClubDetailData) => set({ clubDetail: detail }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  clearClubDetail: () => set({ clubDetail: null }),
}));

export default useClubDetailStore;
export type { ClubDetailData };
