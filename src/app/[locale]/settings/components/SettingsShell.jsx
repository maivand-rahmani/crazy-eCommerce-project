"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/shared/i18n";
import {
  User,
  MapPin,
  SlidersHorizontal,
  ShieldCheck,
  Package,
} from "lucide-react";
import AccountSection from "./AccountSection";
import AddressesSection from "./AddressesSection";
import PreferencesSection from "./PreferencesSection";
import SecuritySection from "./SecuritySection";

const TABS = [
  { id: "account", icon: User },
  { id: "addresses", icon: MapPin },
  { id: "preferences", icon: SlidersHorizontal },
  { id: "security", icon: ShieldCheck },
];

export default function SettingsShell() {
  const t = useTranslations("settings");
  const router = useRouter();
  const [active, setActive] = useState("account");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">{t("title")}</h1>
        <p className="mt-1 text-sm text-unactive-text">{t("subtitle")}</p>
      </div>

      {/* Mobile tabs */}
      <div
        role="tablist"
        aria-label={t("title")}
        className="mb-6 flex gap-2 overflow-x-auto pb-1 md:hidden"
      >
        {TABS.map(({ id, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={active === id}
            onClick={() => setActive(id)}
            className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
              active === id
                ? "border-primary bg-primary/10 text-text"
                : "border-border/60 bg-card text-unactive-text"
            }`}
          >
            <Icon className="h-4 w-4" />
            {t(`tabs.${id}`)}
          </button>
        ))}
        <Link
          href="/orders"
          className="flex shrink-0 items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm font-medium text-unactive-text"
        >
          <Package className="h-4 w-4" />
          {t("tabs.orders")}
        </Link>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 md:block">
          <nav
            aria-label={t("title")}
            className="sticky top-4 rounded-2xl border border-border/60 bg-card p-2"
          >
            {TABS.map(({ id, icon: Icon }) => (
              <button
                key={id}
                aria-current={active === id ? "page" : undefined}
                onClick={() => setActive(id)}
                className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active === id
                    ? "bg-primary/10 text-text"
                    : "text-unactive-text hover:bg-surface hover:text-text"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t(`tabs.${id}`)}
              </button>
            ))}
            <div className="my-2 border-t border-border/60" />
            <button
              onClick={() => router.push("/orders")}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-unactive-text transition hover:bg-surface hover:text-text"
            >
              <Package className="h-4 w-4" />
              {t("tabs.orders")}
            </button>
          </nav>
        </aside>

        {/* Content */}
        <div role="tabpanel" className="min-w-0 flex-1">
          {active === "account" && <AccountSection />}
          {active === "addresses" && <AddressesSection />}
          {active === "preferences" && <PreferencesSection />}
          {active === "security" && <SecuritySection />}
        </div>
      </div>
    </div>
  );
}
