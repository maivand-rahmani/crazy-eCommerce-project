"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Miniloader } from "@/shared";
import { BadgeCheck, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { useUserProfile } from "../hooks/useUserProfile";

export default function AccountSection() {
  const t = useTranslations("settings.account");
  const { data: session } = useSession();
  const { profile, loading, saveProfile } = useUserProfile();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setImage(profile.image || "");
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveProfile({ name, image });
      setEditing(false);
      toast.success(t("saveSuccess"));
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error(error?.message === "saveError" ? t("saveError") : String(error?.message || t("saveError")));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center rounded-2xl border border-border/60 bg-card p-12">
        <Miniloader />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-8 text-center text-unactive-text">
        {t("loadError")}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={
              profile.image || "/icons/profile-circle-svgrepo-com.svg"
            }
            alt={profile.name || profile.email}
            width={64}
            height={64}
            className="rounded-full border border-border/60 object-cover"
          />
          <div>
            <p className="text-lg font-semibold text-text">
              {profile.name || session?.user?.name || profile.email}
            </p>
            <p className="flex items-center gap-1.5 text-sm text-unactive-text">
              {profile.email}
              {profile.emailVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {t("verified")}
                </span>
              )}
            </p>
          </div>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 rounded-xl border border-border/60 px-3 py-2 text-sm font-medium text-text transition hover:bg-surface"
          >
            <Pencil className="h-4 w-4" />
            {t("edit")}
          </button>
        )}
      </div>

      {editing ? (
        <div className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-text">
              {t("displayName")}
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="inputStyle"
              type="text"
              maxLength={100}
              placeholder={t("displayNamePlaceholder")}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-text">
              {t("avatarUrl")}
            </span>
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="inputStyle"
              type="url"
              placeholder="https://…"
            />
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setEditing(false);
                setName(profile.name || "");
                setImage(profile.image || "");
              }}
              className="flex-1 rounded-xl border border-border p-3 text-center text-text transition hover:bg-surface"
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !name.trim()}
              className="flex-1 rounded-xl bg-primary p-3 text-center font-medium text-primary-text transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? t("saving") : t("save")}
            </button>
          </div>
        </div>
      ) : (
        <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-border/60 pt-6 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-unactive-text">{t("memberSince")}</dt>
            <dd className="mt-1 font-medium text-text">
              {profile.createdAt
                ? new Date(profile.createdAt).toLocaleDateString()
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-unactive-text">{t("lastUpdated")}</dt>
            <dd className="mt-1 font-medium text-text">
              {profile.updatedAt
                ? new Date(profile.updatedAt).toLocaleDateString()
                : "—"}
            </dd>
          </div>
        </dl>
      )}
    </div>
  );
}
