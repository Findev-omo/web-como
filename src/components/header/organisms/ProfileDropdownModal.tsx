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
import { closeModal } from "@/lib/utils";
import Avatar from "@/components/common/Avatar";
import Backdrop from "@/components/common/Backdrop";
import { ChevronDown } from "@/assets/icons/chevron";
import { Close } from "@/assets/icons/action";
import { LOGIN_ENDPOINT } from "@/lib/constants";

interface Props {
  profileImage?: string | null;
}

interface Club {
  id: string;
  name: string;
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
            setClubs(clubsRes.data);
          }
        } catch (error) {
          console.error("동호회 목록 로딩 오류:", error);
        }
      }
    };
    loadDropdownData();
  }, [isOpen]);

  const handleClose = () => closeModal("profile-dropdown");

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

  const handleClubChange = async (clubId: string, clubName: string) => {
    try {
      await saveClubId(clubId);
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
      <div className="fixed top-16 right-8 z-50 w-60 rounded-xl bg-gray-0 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="h3 font-semibold text-gray-900">
            {profile?.name || "사용자"}님
          </h3>
          <button onClick={handleClose}>
            <Close className="w-6 h-6 text-gray-900" />
          </button>
        </div>
        <div className="flex flex-col text-center">
          <div className="flex flex-col items-center gap-3.5 p-4">
            <Avatar size="lg" src={profile?.profileImage || profileImage} />
            <div className="caption font-medium text-gray-500">
              {role === "company"
                ? profile?.departmentName || profile?.companyName
                : currentClubName}
            </div>
          </div>

          {role === "club" && (
            <div
              className="p-4 body-1 font-medium text-gray-500 hover:text-gray-900 cursor-pointer border-t border-gray-200"
              onClick={() => setIsClubDropdownOpen((prev) => !prev)}
            >
              <div className="flex items-center justify-between">
                {"동호회 전환"}
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    isClubDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
              {isClubDropdownOpen && (
                <ul className="mt-2 flex flex-col gap-1">
                  {clubs.map((club) => (
                    <li
                      key={club.id}
                      className="p-2 text-left rounded-md hover:bg-gray-100"
                      onClick={() => handleClubChange(club.id, club.name)}
                    >
                      {club.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="p-4 body-1 font-medium text-gray-500 hover:text-gray-900 cursor-pointer border-t border-gray-200">
            <div className="flex items-center justify-between">
              {"내 정보 수정"}
            </div>
          </div>
          <div
            className="p-4 body-1 font-medium text-gray-500 hover:text-gray-900 cursor-pointer border-t border-gray-200"
            onClick={handleLogout}
          >
            {"로그아웃"}
          </div>
        </div>
      </div>
    </div>
  );
}
