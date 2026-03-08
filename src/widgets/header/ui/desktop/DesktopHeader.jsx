"use client";
import React, { Suspense } from "react";
import {
  SearchIcon,
  Heart,
  ShoppingCart,
  CircleUserRound,
  Menu,
} from "lucide-react";
import { Link, usePathname } from "@/shared/i18n";
import { useTranslations, useLocale } from "next-intl";
import { UserInfoModal } from "@/entities/user";
import ProductSearch from "@/features/search/ui/ProductSearch";
import { ShoppingCartButton, WishlistButton, Cyber, ThemeSwitcher, LanguageSwitcher } from "../index";

const routes = [
  { name: "Home", path: "/" },
  { name: "Catalog", path: "/catalog" },
  { name: "About", path: "/about" },
  { name: "Contact us", path: "/contact" },
];

export const DesktopHeader = () => {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <div className="hidden fixed md:block md:left-0 h-fit w-full z-[9999] bg-surface shadow-sm md:top-0">
      <header className="flex items-center justify-between gap-14 p-4 md:justify-center h-22 text-text relative">
        {/* Company logo */}
        <Link href={`/`}>
          <Cyber />
        </Link>

        {/* Search input */}
        <div className="hidden p-4 gap-8 rounded-2xl bg-search-bg w-full md:flex md:max-w-93">
          <ProductSearch />
        </div>

        {/* Desktop nav */}
        <ul className="hidden md:flex gap-13">
          {routes.map(
            (route) =>
              !route.onlyPhone && (
                <li
                  className={pathname === route.path ? "font-bold" : ""}
                  key={route.name}
                >
                  <Link href={`${route.path}`}>
                    {t(`header.nav.${route.name}`)}
                  </Link>
                </li>
              ),
          )}
        </ul>

        {/* Icons */}
        <div className="hidden md:flex center gap-6">
          <Suspense fallback={<Heart />}>
            <WishlistButton />
          </Suspense>
          <Suspense fallback={<ShoppingCart />}>
            <ShoppingCartButton />
          </Suspense>
          <LanguageSwitcher />
          <ThemeSwitcher />
          <UserInfoModal />
        </div>
      </header>
    </div>
  );
};
