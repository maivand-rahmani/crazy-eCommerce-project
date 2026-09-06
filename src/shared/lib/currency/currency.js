/**
 * Central store-currency config — single source of truth for ALL money formatting.
 *
 * The store prices in a single currency (USD, amounts stored as integer cents).
 * Per-locale entries control Intl formatting (grouping, decimals, symbol placement)
 * while the currency CODE stays explicit per locale with a fallback to `en`.
 * Real multi-currency (conversion + admin-controlled code) is a later step and
 * must extend THIS mapping — never add ad-hoc "$"/"USD" literals in components.
 */

import { DEFAULT_SETTINGS } from "@/features/admin-settings/model/defaults";

export const DEFAULT_LOCALE = "en";
export const STORE_CURRENCY_CODE = DEFAULT_SETTINGS["currency.code"];

export const CURRENCY_BY_LOCALE = {
  en: { code: DEFAULT_SETTINGS["currency.code"], symbol: "$", intlLocale: "en-US" },
  ru: { code: DEFAULT_SETTINGS["currency.code"], symbol: "$", intlLocale: "ru-RU" },
  fa: { code: DEFAULT_SETTINGS["currency.code"], symbol: "$", intlLocale: "fa-IR" },
};

export function getCurrencyConfig(locale) {
  const key =
    typeof locale === "string" ? locale.toLowerCase() : DEFAULT_LOCALE;
  return CURRENCY_BY_LOCALE[key] || CURRENCY_BY_LOCALE[DEFAULT_LOCALE];
}

/**
 * Format integer cents using the centralized currency config.
 * e.g. formatMoney(1500, "en") -> "$15.00", formatMoney(1500, "ru") -> "15,00 $"
 */
export function formatMoney(cents, locale, options) {
  const config = getCurrencyConfig(locale);
  const value = Number(cents || 0) / 100;
  return new Intl.NumberFormat(config.intlLocale, {
    style: "currency",
    currency: config.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

/** Human label for settings UI, e.g. "USD ($)". */
export function getCurrencyLabel(locale) {
  const config = getCurrencyConfig(locale);
  return `${config.code} (${config.symbol})`;
}
