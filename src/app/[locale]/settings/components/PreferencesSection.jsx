"use client";

import { useTranslations } from "next-intl";
import { LangSwitcher } from "@/shared/i18n";
import { Globe, Banknote, Palette } from "lucide-react";

function Row({ icon: Icon, title, description, control }) {
  return (
    <div className="flex flex-col gap-3 border-b border-border/60 py-5 last:border-0 last:pb-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <p className="font-medium text-text">{title}</p>
          <p className="mt-0.5 text-sm text-unactive-text">{description}</p>
        </div>
      </div>
      <div className="shrink-0 pl-8 sm:pl-0">{control}</div>
    </div>
  );
}

export default function PreferencesSection() {
  const t = useTranslations("settings.preferences");

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <h2 className="mb-2 text-lg font-semibold text-text">{t("title")}</h2>
      <p className="mb-4 text-sm text-unactive-text">{t("description")}</p>

      <Row
        icon={Globe}
        title={t("languageTitle")}
        description={t("languageDescription")}
        control={<LangSwitcher />}
      />
      <Row
        icon={Banknote}
        title={t("currencyTitle")}
        description={t("currencyDescription", { currency: "USD ($)" })}
        control={
          <span className="rounded-xl border border-border/60 px-4 py-2 text-sm font-medium text-unactive-text">
            USD ($)
          </span>
        }
      />
      <Row
        icon={Palette}
        title={t("themeTitle")}
        description={t("themeDescription")}
        control={
          <span
            title="TODO (Phase 2): wire to theme system when it lands"
            className="cursor-not-allowed rounded-xl border border-border/60 px-4 py-2 text-sm font-medium text-unactive-text opacity-60"
          >
            {t("themeComingSoon")}
          </span>
        }
      />
      {/*
        TODO (Phase 2 — admin settings):
        - Currency becomes editable once admin-controlled store settings land
          (currently hardcoded "USD ($)" suffix in ProductCard).
        - Theme toggle wires up once a theme system (e.g. next-themes) exists.
      */}
    </div>
  );
}
