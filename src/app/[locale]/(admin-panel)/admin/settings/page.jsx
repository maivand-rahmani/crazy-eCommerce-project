import React from "react";
import { getTranslations } from "next-intl/server";

import { SectionTitle } from "@/shared";
import { requireSuperAdminPage } from "@/features/admin-common";
import { getSettings } from "@/features/admin-settings/model/settings";
import AdminSettingsTabs from "@/features/admin-settings/ui/AdminSettingsTabs";

export const metadata = {
  title: "Admin Settings | Cyber",
  robots: "noindex, nofollow",
};

export default async function SettingsPage({ params }) {
  const { locale } = await params;
  await requireSuperAdminPage(locale);
  const t = await getTranslations({ locale, namespace: "adminSettings" });
  const settings = await getSettings();

  return (
    <div className="flex flex-col gap-[var(--admin-gap)]">
      <SectionTitle title={t("title")} description={t("description")} />
      <AdminSettingsTabs initialSettings={settings} />
    </div>
  );
}
