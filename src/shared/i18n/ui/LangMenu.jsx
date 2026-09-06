"use client";

import { useState } from "react";
import { Check, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/shared/i18n";

const LOCALES = [
  { code: "en", labelKey: "en" },
  { code: "ru", labelKey: "ru" },
  { code: "fa", labelKey: "fa" },
];

/**
 * Compact language switcher: Globe button + dropdown menu (EN / RU / FA).
 * Mirrors the ThemeSwitcher interaction and styling tokens.
 */
const LangMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("header.language.options");

  const handleLocaleChange = (nextLocale) => {
    setIsOpen(false);
    if (nextLocale === locale) return;

    router.replace(pathname, { locale: nextLocale, scroll: false });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/70 text-muted shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-card hover:text-text hover:shadow-md"
        aria-label="Switch language"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe className="h-4.5 w-4.5" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute right-0 top-full z-50 mt-3 w-44 overflow-hidden rounded-2xl border border-border/60 bg-card/95 p-1.5 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)] backdrop-blur-xl"
            role="menu"
            aria-label="Language options"
          >
            {LOCALES.map(({ code, labelKey }) => (
              <button
                key={code}
                onClick={() => handleLocaleChange(code)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                  locale === code
                    ? "bg-background text-text shadow-sm"
                    : "text-muted hover:bg-background/80 hover:text-text"
                }`}
                role="menuitem"
              >
                <span className="w-5 text-xs font-semibold uppercase">
                  {code}
                </span>
                <span className="flex-1">{t(labelKey)}</span>
                {locale === code ? <Check className="h-4 w-4" /> : null}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LangMenu;
