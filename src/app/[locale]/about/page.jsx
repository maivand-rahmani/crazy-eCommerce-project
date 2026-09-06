import React from "react";
import {
  Cloud,
  Container,
  Database,
  FileCode2,
  FolderTree,
  Github,
  Globe2,
  Heart,
  Layers,
  Mail,
  Rocket,
  ScrollText,
  ShieldCheck,
  ShoppingBag,
  Star,
  TicketPercent,
  Wallet,
  Wind,
} from "lucide-react";

import { getTranslations } from "next-intl/server";
import { getSettings } from "@/features/admin-settings/model/settings";
import { Link } from "@/shared/i18n";

export const metadata = {
  title: "About the project | Cyber",
  description:
    "Cyber is a personal portfolio e-commerce project — Next.js 15, PostgreSQL, Prisma, NextAuth and next-intl, built end to end.",
};

const REPO_URL = "https://github.com/maivand-rahmani/crazy-eCommerce-project";
const GITHUB_URL = "https://github.com/maivand-rahmani";

const STACK_ICONS = {
  nextjs: Layers,
  typescript: FileCode2,
  database: Database,
  auth: ShieldCheck,
  i18n: Globe2,
  styling: Wind,
  media: Cloud,
  hosting: Rocket,
  devops: Container,
};

const ARCH_ICONS = {
  fsd: FolderTree,
  actions: ScrollText,
  admin: ShieldCheck,
};

const FEATURE_ICONS = {
  catalog: Layers,
  reviews: Star,
  wishlist: Heart,
  coupons: TicketPercent,
  orders: ShoppingBag,
  wallet: Wallet,
};

export default async function AboutPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  let settings = {};
  try {
    settings = await getSettings();
  } catch {}
  const storeName = settings["store.name"] || "Cyber";

  return (
    <main className="bg-bg text-text">
      {/* Hero */}
      <section className="w-full bg-surface py-24 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-primary">
          {storeName}
        </p>
        <h1 className="mx-auto mb-4 max-w-3xl text-4xl font-bold md:text-5xl">
          {t("hero.title")}
        </h1>
        <p className="mx-auto max-w-2xl px-6 text-unactive-text md:px-0">
          {t("hero.subtitle")}
        </p>
      </section>

      {/* What is Cyber */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:px-10">
        <div>
          <h2 className="mb-6 text-3xl font-semibold">
            {t("what.title", { store: storeName })}
          </h2>
          <p className="mb-4 leading-relaxed text-unactive-text">
            {t("what.p1")}
          </p>
          <p className="leading-relaxed text-unactive-text">{t("what.p2")}</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-muted">
            {t("what.factsTitle")}
          </h3>
          <ul className="grid gap-3 text-sm">
            {[
              t("what.fact1"),
              t("what.fact2"),
              t("what.fact3"),
              t("what.fact4"),
            ].map((fact) => (
              <li
                key={fact}
                className="flex items-start gap-3 text-unactive-text"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tech stack */}
      <section className="w-full bg-surface px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-semibold">{t("stack.title")}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-unactive-text">
              {t("stack.subtitle")}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(STACK_ICONS).map(([key, Icon]) => (
              <div
                key={key}
                className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mb-1.5 text-lg font-semibold">
                  {t(`stack.items.${key}.name`)}
                </h3>
                <p className="text-sm leading-relaxed text-unactive-text">
                  {t(`stack.items.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture notes */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:px-10">
        <div className="mb-10">
          <h2 className="text-3xl font-semibold">{t("arch.title")}</h2>
          <p className="mt-4 max-w-2xl text-unactive-text">
            {t("arch.subtitle")}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {Object.entries(ARCH_ICONS).map(([key, Icon]) => (
            <div
              key={key}
              className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
            >
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mb-2 text-lg font-semibold">
                {t(`arch.items.${key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-unactive-text">
                {t(`arch.items.${key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features showcase */}
      <section className="w-full bg-surface px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <h2 className="text-3xl font-semibold">{t("features.title")}</h2>
            <p className="mt-4 max-w-2xl text-unactive-text">
              {t("features.subtitle")}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(FEATURE_ICONS).map(([key, Icon]) => (
              <div
                key={key}
                className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
              >
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="mb-1 font-semibold">
                    {t(`features.items.${key}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-unactive-text">
                    {t(`features.items.${key}.desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:px-10">
        <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm md:p-12">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="flex items-center gap-5">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
                MR
              </span>
              <div>
                <p className="mb-1 text-sm font-medium uppercase tracking-[0.22em] text-muted">
                  {t("dev.eyebrow")}
                </p>
                <h2 className="text-2xl font-semibold">
                  {t("dev.name")}
                </h2>
                <p className="text-primary">{t("dev.role")}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-text transition hover:opacity-90"
              >
                <Github className="h-4 w-4" />
                {t("dev.repoCta")}
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card px-5 py-3 text-sm font-semibold text-text transition hover:border-border hover:bg-surface"
              >
                {t("dev.githubCta")}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card px-5 py-3 text-sm font-semibold text-text transition hover:border-border hover:bg-surface"
              >
                <Mail className="h-4 w-4" />
                {t("dev.contactCta")}
              </Link>
            </div>
          </div>
          <p className="mt-8 max-w-3xl leading-relaxed text-unactive-text">
            {t("dev.bio")}
          </p>
        </div>
      </section>
    </main>
  );
}
