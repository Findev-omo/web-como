"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/store/authStore";
import {
  deleteAllCookies,
  getClubName,
  getRole,
  saveClubId,
  saveClubName,
} from "@/lib/cookies";
import { getData } from "@/api/action";
import { closeModal, openModal } from "@/lib/utils";
import Avatar from "@/components/common/Avatar";
import Backdrop from "@/components/common/Backdrop";
import { ChevronDown } from "@/assets/icons/chevron";
import { Close } from "@/assets/icons/action";
import { LOGIN_ENDPOINT } from "@/lib/constants";

interface Props {
  profileImage?: string | null;
}

interface Club {
  clubId: number;
  clubName: string;
}

export default function ProfileDropdownModal({ profileImage }: Props) {
  const router = useRouter();
  const { profile, clearAuth } = useAuthStore();
  const [role, setRole] = useState<string | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [currentClubName, setCurrentClubName] = useState<string | null>(null);
  const [isClubDropdownOpen, setIsClubDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const modalElement = document.getElementById("profile-dropdown");
    const observer = new MutationObserver(() => {
      setIsOpen(!modalElement?.classList.contains("hidden"));
    });
    if (modalElement) {
      observer.observe(modalElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const loadDropdownData = async () => {
      const userRole = await getRole();
      setRole(userRole || null);

      if (userRole === "club") {
        const clubName = await getClubName();
        setCurrentClubName(clubName || null);
        try {
          const clubsRes = await getData("v1/executive/club/select", true);
          if (clubsRes.resultCode === "OK" && clubsRes.data) {
            console.log("동호회 목록 데이터:", clubsRes.data); // 디버깅을 위한 로그
            setClubs(clubsRes.data);
          }
        } catch (error) {
          console.error("동호회 목록 로딩 오류:", error);
        }
      }
    };
    loadDropdownData();
  }, [isOpen]);

  const handleClose = () => closeModal(); // 모든 모달 닫기

  const handleLogout = async () => {
    try {
      await deleteAllCookies();
      clearAuth();
      router.push(LOGIN_ENDPOINT);
      handleClose();
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  const handleClubChange = async (clubId: number, clubName: string) => {
    try {
      await saveClubId(clubId.toString());
      await saveClubName(clubName);
      setCurrentClubName(clubName);
      setIsClubDropdownOpen(false);
      handleClose();
      window.location.reload();
    } catch (error) {
      console.error("동호회 전환 오류:", error);
    }
  };

  return (
    <div id="profile-dropdown" className="fixed modal hidden">
      <Backdrop onClick={handleClose} />
      <div className="fixed top-16 right-[30px] z-50 w-[390px] rounded-xl border border-gray-400">
        <div className="space-y-[28px] p-8 rounded-t-xl bg-gray-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar
                size="w-10 h-10"
                src={profile?.profileImage || profileImage}
              />
              <span className="h3 font-semibold text-gray-900">
                {profile?.name || "사용자"}님
              </span>
            </div>
            <div
              className="flex items-center justify-end w-8 h-8 cursor-pointer"
              onClick={handleClose}
            >
              <Close className="w-6 h-6 text-gray-900" />
            </div>
          </div>

          <div className="space-y-2">
            {role === "club" && (
              <div className="space-y-1 p-3 rounded-md bg-orange-50">
                <span className="body-2 font-medium text-gray-600">
                  관리중인 동호회
                </span>
                <div className="relative">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setIsClubDropdownOpen((prev) => !prev)}
                  >
                    <span className="h4 font-bold text-gray-900">
                      {currentClubName || "동호회 개설 테스트"}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        isClubDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {isClubDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-2 bg-gray-0 rounded-md shadow-md z-50 border border-gray-200">
                      {clubs.map((club) => (
                        <div
                          key={club.clubId}
                          className="p-3 h4 font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                          onClick={() =>
                            handleClubChange(club.clubId, club.clubName)
                          }
                        >
                          {club.clubName}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div
              className="w-full p-3 h4 font-medium text-gray-700 cursor-pointer"
              onClick={() => openModal("customer-center")}
            >
              고객센터
            </div>
            <div
              className="w-full p-3 h4 font-medium text-gray-700 cursor-pointer"
              onClick={() => router.push("/club/support")}
            >
              문의 및 기술지원
            </div>
          </div>
        </div>

        <div
          className="w-full py-3.5 rounded-b-xl text-center h3 font-semibold text-gray-0 bg-brand-orange cursor-pointer"
          onClick={handleLogout}
        >
          로그아웃
        </div>
      </div>
    </div>
  );
}
