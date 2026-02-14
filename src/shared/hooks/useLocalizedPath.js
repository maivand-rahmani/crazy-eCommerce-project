"use client";

import { useLocale } from "next-intl";

export function useLocalizedPath() {
  const locale = useLocale();

  const buildPath = (path) => {
    return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
  };

  return buildPath;
}
