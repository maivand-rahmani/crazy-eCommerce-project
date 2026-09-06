"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Fetch } from "@/shared/lib/fetch";
import { Miniloader } from "@/shared";
import { KeyRound, MonitorSmartphone, LogOut, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function SecuritySection() {
  const t = useTranslations("settings.security");
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changing, setChanging] = useState(false);
  const [revoking, setRevoking] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await Fetch("/api/user/profile", "GET");
        if (res?.data) setProfile(res.data);
      } catch (error) {
        console.error("Failed to load security info:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error(t("passwordMismatch"));
      return;
    }
    setChanging(true);
    try {
      const res = await Fetch("/api/user/password", "PUT", {
        currentPassword,
        newPassword,
      });
      if (res?.status === 200) {
        toast.success(t("passwordChanged"));
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res?.error || t("passwordError"));
      }
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error(t("passwordError"));
    } finally {
      setChanging(false);
    }
  };

  const handleRevokeOthers = async () => {
    setRevoking(true);
    try {
      const res = await Fetch("/api/user/sessions", "DELETE");
      if (res?.status === 200) {
        toast.success(t("sessionsRevoked", { count: res.data?.revoked ?? 0 }));
        const refreshed = await Fetch("/api/user/profile", "GET");
        if (refreshed?.data) setProfile(refreshed.data);
      } else {
        toast.error(res?.error || t("sessionsError"));
      }
    } catch (error) {
      console.error("Failed to revoke sessions:", error);
      toast.error(t("sessionsError"));
    } finally {
      setRevoking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center rounded-2xl border border-border/60 bg-card p-12">
        <Miniloader />
      </div>
    );
  }

  const sessions = profile?.activeSessions ?? [];

  return (
    <div className="flex flex-col gap-6">
      {/* Password */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-text">
          <KeyRound className="h-5 w-5 text-primary" />
          {t("passwordTitle")}
        </h2>
        {profile?.hasPassword ? (
          <form
            onSubmit={handleChangePassword}
            className="mt-4 flex max-w-md flex-col gap-4"
          >
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-text">
                {t("currentPassword")}
              </span>
              <input
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="inputStyle"
                type="password"
                autoComplete="current-password"
                required
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-text">
                {t("newPassword")}
              </span>
              <input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="inputStyle"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-text">
                {t("confirmPassword")}
              </span>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="inputStyle"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>
            <button
              type="submit"
              disabled={changing}
              className="w-fit rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-text transition hover:opacity-80 disabled:opacity-50"
            >
              {changing ? t("changing") : t("changePassword")}
            </button>
          </form>
        ) : (
          <p className="mt-3 text-sm text-unactive-text">{t("oauthNote")}</p>
        )}
      </div>

      {/* Sessions */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-text">
          <MonitorSmartphone className="h-5 w-5 text-primary" />
          {t("sessionsTitle")}
        </h2>
        <p className="mt-1 text-sm text-unactive-text">
          {t("sessionsDescription", { email: session?.user?.email ?? "" })}
        </p>
        <p className="mt-3 text-sm text-text">
          {t("activeSessions", { count: sessions.length })}
        </p>
        {sessions.length > 0 && (
          <ul className="mt-3 flex max-w-md flex-col gap-2">
            {sessions.slice(0, 5).map((s, i) => (
              <li
                key={i}
                className="rounded-xl border border-border/60 px-4 py-2.5 text-xs text-unactive-text"
              >
                {t("sessionRow", {
                  date: s.createdAt
                    ? new Date(s.createdAt).toLocaleString()
                    : "—",
                })}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={handleRevokeOthers}
            disabled={revoking}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text transition hover:bg-surface disabled:opacity-50"
          >
            {revoking ? t("revoking") : t("revokeOthers")}
          </button>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-1.5 rounded-xl border border-danger/40 px-4 py-2.5 text-sm font-medium text-danger transition hover:bg-danger/10"
          >
            <LogOut className="h-4 w-4" />
            {t("signOut")}
          </button>
        </div>
      </div>

      {/* Danger zone — stub for Phase 2 */}
      <div className="rounded-2xl border border-danger/40 bg-card p-6 opacity-70">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-danger">
          <Trash2 className="h-5 w-5" />
          {t("dangerTitle")}
        </h2>
        <p className="mt-1 text-sm text-unactive-text">
          {t("dangerDescription")}
        </p>
        <button
          disabled
          title="TODO (Phase 2): account deletion flow with confirmation + grace period"
          className="mt-4 cursor-not-allowed rounded-xl border border-danger/40 px-4 py-2.5 text-sm font-medium text-danger opacity-50"
        >
          {t("deleteAccount")} ({t("comingSoon")})
        </button>
      </div>
    </div>
  );
}
