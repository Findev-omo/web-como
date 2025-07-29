import { create } from "zustand";

interface ProfileData {
  profileImage: string;
  name: string;
  departmentName?: string;
  companyName?: string;
}

interface AuthState {
  accessToken: string | null;
  profile: ProfileData | null;
  isProfileLoading: boolean;
  setAccessToken: (token: string) => void;
  setProfile: (profile: ProfileData) => void;
  setProfileLoading: (isLoading: boolean) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  accessToken:
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
  profile: null,
  isProfileLoading: false,
  setAccessToken: (token: string) => {
    set({ accessToken: token });
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
    }
  },
  setProfile: (profile: ProfileData) => set({ profile }),
  setProfileLoading: (isLoading: boolean) =>
    set({ isProfileLoading: isLoading }),
  clearAuth: () => {
    set({ accessToken: null, profile: null, isProfileLoading: false });
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }
  },
}));

export default useAuthStore;
