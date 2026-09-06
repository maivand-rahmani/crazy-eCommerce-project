"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Fetch } from "@/shared/lib/fetch";
import toast from "react-hot-toast";

// Shared profile loader for settings sections (Account, Security).
// Single source of truth for GET /api/user/profile + PATCH updates.
export function useUserProfile() {
  const t = useTranslations("settings.account");
  const { update: updateSession } = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const res = await Fetch("/api/user/profile", "GET");
      if (res?.data) {
        setProfile(res.data);
        return res.data;
      }
      toast.error(t("loadError"));
      return null;
    } catch (error) {
      console.error("Failed to load profile:", error);
      toast.error(t("loadError"));
      return null;
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const saveProfile = useCallback(
    async ({ name, image }) => {
      const res = await Fetch("/api/user/profile", "PATCH", {
        name: name.trim(),
        image: image.trim(),
      });
      if (res?.data) {
        setProfile((p) => ({ ...p, ...res.data }));
        // Refresh the NextAuth session so header/avatar update everywhere.
        await updateSession({ name: res.data.name, image: res.data.image });
        return res.data;
      }
      throw new Error(res?.error || "saveError");
    },
    [updateSession],
  );

  // Quiet reload: refresh data without flashing the full-section loader.
  const reload = useCallback(() => load(true), [load]);

  return { profile, loading, reload, saveProfile };
}
