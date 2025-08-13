"use client";

import { useEffect, useRef } from "react";
import useAuthStore from "@/lib/store/authStore";

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
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    const loadProfileData = async () => {
      // 이미 요청했던 적이 있거나, 로딩 중이거나, 프로필이 존재하면 재호출하지 않음
      if (hasRequestedRef.current || isProfileLoading || profile) return;
      hasRequestedRef.current = true;
      setProfileLoading(true);
      try {
        // 통합 유저 정보 엔드포인트로 변경
        const r = await fetch(`/api/server/member`, {
          headers: { accept: "application/json" },
        });
        const res: any = await r.json();

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
    // 의존성 최소화: 최초 1회만 시도
  }, [profile, isProfileLoading, setProfile, setProfileLoading]);

  // 불필요한 콘솔 출력 제거

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
