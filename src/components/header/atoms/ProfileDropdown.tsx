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
  const { profile, setProfile, isProfileLoading, setProfileLoading } =
    useAuthStore();

  useEffect(() => {
    const loadProfileData = async () => {
      if (!profile && !isProfileLoading) {
        setProfileLoading(true);
        try {
          const role = await getRole();
          console.log("사용자 역할:", role);
          let endpoint = "";
          if (role === "club") {
            endpoint = `v1/executive/club/{clubId}/my-profile`;
          } else if (role === "company") {
            endpoint = `v1/manager/member/my-profile`;
          }

          if (endpoint) {
            const response = await fetch(`/api/server/${endpoint}`, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            });
            const res = await response.json();
            console.log("프로필 API 응답:", res);
            if (res?.resultCode === "OK" && res.data) {
              console.log("프로필 데이터:", res.data);
              console.log("프로필 이미지 URL:", res.data.profileImage);
              setProfile(res.data);
            } else {
              console.error("API 오류:", res?.resultMessage);
            }
          }
        } catch (error) {
          console.error("API 호출 오류:", error);
        } finally {
          setProfileLoading(false);
        }
      }
    };

    loadProfileData();
  }, [profile, isProfileLoading, setProfile, setProfileLoading]);

  console.log("현재 프로필 상태:", {
    profile: profile,
    profileImage: profile?.profileImage,
    propProfileImage: profileImage,
  });

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
