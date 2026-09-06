"use client";

import { useLocale, useTranslations } from "next-intl";
import { LangSwitcher } from "@/shared/i18n";
import { useTheme, THEMES } from "@/shared/ui/theme";
import { getCurrencyLabel } from "@/shared/lib/currency/currency";
import { Globe, Banknote, Palette, Check } from "lucide-react";

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

function ThemeControl() {
  const t = useTranslations("settings.preferences");
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label={t("themeTitle")}
      className="flex flex-wrap gap-2"
    >
      {THEMES.map((name) => {
        const selected = theme === name;
        return (
          <button
            key={name}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setTheme(name)}
            className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition ${
              selected
                ? "border-primary bg-primary/10 text-text"
                : "border-border/60 text-unactive-text hover:bg-surface hover:text-text"
            }`}
          >
            {selected && <Check className="h-3.5 w-3.5" />}
            {t(`themeOptions.${name}`)}
          </button>
        );
      })}
    </div>
  );
}

export default function PreferencesSection() {
  const t = useTranslations("settings.preferences");
  const locale = useLocale();
  const currencyLabel = getCurrencyLabel(locale);

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
        description={t("currencyDescription", { currency: currencyLabel })}
        control={
          <span className="rounded-xl border border-border/60 px-4 py-2 text-sm font-medium text-text">
            {currencyLabel}
          </span>
        }
      />
      <Row
        icon={Palette}
        title={t("themeTitle")}
        description={t("themeDescription")}
        control={<ThemeControl />}
      />
    </div>
  );
}
