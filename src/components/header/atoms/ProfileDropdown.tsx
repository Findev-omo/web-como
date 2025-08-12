"use client";

import { useEffect } from "react";
import useAuthStore from "@/lib/store/authStore";
// 서버 액션 사용 중단 (무한 호출 방지)
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
      // 이미 로딩 중이거나 프로필이 존재하면 재호출하지 않음
      if (isProfileLoading || profile) return;
      setProfileLoading(true);
      try {
        const role = await getRole();
        let res: any;
        if (role === "club") {
          const r = await fetch(
            `/api/server/v1/executive/club/{clubId}/my-profile`,
            {
              headers: { accept: "application/json" },
            }
          );
          res = await r.json();
        } else if (role === "company") {
          const r = await fetch(`/api/server/v1/manager/member/my-profile`, {
            headers: { accept: "application/json" },
          });
          res = await r.json();
        } else {
          return; // 역할이 없으면 한 번만 시도 후 종료
        }

        if (
          (res?.resultCode === "OK" ||
            res?.resultCode === 200 ||
            res?.resultCode === "200") &&
          res?.data
        ) {
          setProfile(res.data);
        }
        // 실패(resultCode 500 등)는 조용히 무시하여 무한 재시도 방지
      } catch (_) {
        // silent fail to avoid loop
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfileData();
    // 의존성 최소화: 프로필 미로딩/미보유 상태에서 단 한 번 로드하도록 제한
  }, [profile, isProfileLoading]);

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
