"use client";
import React from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "@/shared/i18n";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("footer");

  const navLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.products"), href: "/catalog" },
    { label: t("nav.contacts"), href: "/contact" },
    { label: t("nav.about"), href: "/about" },
  ];

  const socialLinks = [
    { label: "Instagram", href: "#", icon: Instagram },
    { label: "Twitter", href: "#", icon: Twitter },
    { label: "Facebook", href: "#", icon: Facebook },
  ];

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border/60 bg-background text-text">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(220px,0.9fr)_minmax(220px,0.9fr)]">
          <div className="space-y-5">
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-border/60 bg-card/70 px-5 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-text shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-card"
            >
              {t("logo")}
            </Link>
            <p className="max-w-md text-sm leading-7 text-muted">
              {t("tagline")}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
              {t("nav.title")}
            </h2>
            <nav className="grid gap-2.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit text-sm text-muted transition-colors duration-200 hover:text-text"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
              {t("social.title")}
            </h2>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-card/70 text-muted shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-card hover:text-text hover:shadow-md"
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border/60 pt-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>{t("copyright")}</p>
          <p className="text-xs uppercase tracking-[0.22em] text-muted/80">
            {t("logo")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
