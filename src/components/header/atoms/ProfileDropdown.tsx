"use client";

import { useEffect } from "react";
import useAuthStore from "@/lib/store/authStore";
import { getData } from "@/api/action";
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
          let res;
          if (role === "club") {
            res = await getData(`v1/executive/club/{clubId}/my-profile`, true);
          } else if (role === "company") {
            res = await getData(`v1/manager/member/my-profile`, true);
          }

          if (res?.resultCode === "OK" && res.data) {
            setProfile(res.data);
          } else {
            console.error("API 오류:", res?.resultMessage);
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
