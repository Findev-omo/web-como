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
  isProfileLoaded: boolean; // 프로필이 한 번 로드되었는지 확인하는 플래그
  setAccessToken: (token: string) => void;
  setProfile: (profile: ProfileData) => void;
  setProfileLoading: (isLoading: boolean) => void;
  setProfileLoaded: (isLoaded: boolean) => void;
  clearAuth: () => void;
}

// localStorage에서 프로필 정보를 가져오는 함수
const getStoredProfile = (): ProfileData | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("userProfile");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const useAuthStore = create<AuthState>((set) => ({
  accessToken:
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
  profile: getStoredProfile(),
  isProfileLoading: false,
  isProfileLoaded: !!getStoredProfile(), // 저장된 프로필이 있으면 로드된 것으로 간주
  setAccessToken: (token: string) => {
    set({ accessToken: token });
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
    }
  },
  setProfile: (profile: ProfileData) => {
    set({ profile, isProfileLoaded: true });
    if (typeof window !== "undefined") {
      localStorage.setItem("userProfile", JSON.stringify(profile));
    }
  },
  setProfileLoading: (isLoading: boolean) =>
    set({ isProfileLoading: isLoading }),
  setProfileLoaded: (isLoaded: boolean) => set({ isProfileLoaded: isLoaded }),
  clearAuth: () => {
    set({
      accessToken: null,
      profile: null,
      isProfileLoading: false,
      isProfileLoaded: false,
    });
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userProfile");
    }
  },
}));

export default useAuthStore;
