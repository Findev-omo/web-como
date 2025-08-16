"use client";

import { useEffect } from "react";
import useAuthStore from "@/lib/store/authStore";
import { getRole } from "@/lib/cookies";
import { openModal } from "@/lib/utils";
import Avatar from "@/components/common/Avatar";
import { ChevronDown } from "@/assets/icons/chevron";
import ProfileDropdownModal from "@/components/header/organisms/ProfileDropdownModal";

interface Props {
  profileImage?: string;
}

export default function ProfileDropdown({ profileImage }: Props) {
  const {
    profile,
    setProfile,
    isProfileLoading,
    setProfileLoading,
    isProfileLoaded,
  } = useAuthStore();

  useEffect(() => {
    // 프로필이 이미 로드되어 있고, 로딩 중이 아니면 API 호출하지 않음
    if (isProfileLoaded && profile && !isProfileLoading) {
      return;
    }

    // 이미 로딩 중이면 중복 호출 방지
    if (isProfileLoading) {
      return;
    }

    const loadProfileData = async () => {
      setProfileLoading(true);
      try {
        const role = await getRole();
        console.log("사용자 역할:", role);

        // OpenAPI에 따라 유저 정보는 /member로 통일
        const response = await fetch(`/api/server/member`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const res = await response.json();
        console.log("프로필 API 응답:", res);

        if ((res?.resultCode === 200 || res?.resultCode === "OK") && res.data) {
          const profileData = {
            profileImage: res.data.profileImage ?? undefined,
            name: res.data.name ?? "",
            departmentName: res.data.Department ?? res.data.departmentName,
            companyName: res.data.companyName ?? undefined,
          } as any;
          setProfile(profileData);
        } else {
          console.error("API 오류:", res?.resultMessage);
        }
      } catch (error) {
        console.error("API 호출 오류:", error);
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfileData();
  }, []); // 빈 의존성 배열로 컴포넌트 마운트 시에만 실행

  // 개발 환경에서만 로그 출력
  if (process.env.NODE_ENV === "development") {
    console.log("현재 프로필 상태:", {
      profile: profile,
      profileImage: profile?.profileImage,
      propProfileImage: profileImage,
      isProfileLoaded,
      isProfileLoading,
    });
  }

  return (
    <>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => openModal("profile-dropdown")}
      >
        <Avatar src={profile?.profileImage || profileImage} />
        <ChevronDown className="w-6 h-6 text-gray-500" />
      </div>
      <ProfileDropdownModal profileImage={profileImage} />
    </>
  );
}
