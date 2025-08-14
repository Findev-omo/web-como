"use client";

import { useEffect, useRef } from "react";
import useAuthStore from "@/lib/store/authStore";

export default function AuthInitializer() {
  const { profile, setProfile, isProfileLoading, setProfileLoading } =
    useAuthStore();
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    const loadProfileData = async () => {
      if (hasRequestedRef.current || isProfileLoading || profile) return;
      hasRequestedRef.current = true;
      setProfileLoading(true);
      try {
        const r = await fetch(`/api/server/member`, {
          headers: { accept: "application/json" },
          cache: "no-store",
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
      } catch (_) {
        // silent fail
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfileData();
  }, [profile, isProfileLoading, setProfile, setProfileLoading]);

  return null;
}
