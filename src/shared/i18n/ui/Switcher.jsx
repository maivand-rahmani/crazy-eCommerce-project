"use client";

import React from "react";
import { useRouter, usePathname } from "@/shared/i18n/model/routing";
import { useLocale } from "next-intl";

const LangSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const changeLang = () => {
    const nextLocale = locale === "en" ? "ru" : "en";

    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="flex gap-3">
      <button
        className="border p-3"
        onClick={changeLang}
      >
        {locale.toUpperCase()}
      </button>
    </div>
  );
};

export default LangSwitcher;
