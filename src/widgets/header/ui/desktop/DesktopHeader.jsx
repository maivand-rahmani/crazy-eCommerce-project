"use client";
import React, { Suspense } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "@/shared/i18n";
import { useTranslations } from "next-intl";
import { UserInfoModal } from "@/entities/user";
import ProductSearch from "@/features/search/ui/ProductSearch";
import {
  ShoppingCartButton,
  WishlistButton,
  Cyber,
  ThemeSwitcher,
} from "../index";
import { NavLink } from "@/shared";

const routes = [
  { name: "Home", path: "/" },
  { name: "Catalog", path: "/catalog" },
  { name: "About", path: "/about" },
  { name: "Contact us", path: "/contact" },
];

export const DesktopHeader = () => {
  const t = useTranslations();

  return (
    <div className="fixed left-0 top-0 z-9999 hidden w-full border-b border-border/50 bg-background/80 backdrop-blur-xl md:block">
      <header className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-4 text-text lg:gap-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center rounded-full border border-border/60 bg-card/80 px-4 py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-card hover:shadow-md"
        >
          <Cyber />
        </Link>

        <div className="hidden min-w-0 flex-1 lg:flex">
          <div className="w-full rounded-3xl border border-border/60 bg-card/70 p-2 shadow-sm backdrop-blur-sm">
            <ProductSearch className="w-full" />
          </div>
        </div>

        <nav className="hidden xl:block">
          <ul className="flex items-center gap-1 rounded-full border border-border/60 bg-card/70 p-2 shadow-sm backdrop-blur-sm">
            {routes.map((route) => (
              <li key={route.name}>
                <NavLink
                  href={`${route.path}`}
                  exact={route.path === "/"}
                  isActiveStyle="rounded-full bg-background text-text shadow-sm"
                  className="inline-flex items-center rounded-full px-4 py-2.5 text-sm font-medium text-muted transition-all duration-200 hover:bg-background/80 hover:text-text"
                >
                  {t(`header.nav.${route.name}`)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 rounded-full border border-border/60 bg-card/75 p-2 shadow-sm backdrop-blur-sm">
          <Suspense
            fallback={
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/70 text-muted">
                <Heart className="h-4.5 w-4.5" />
              </div>
            }
          >
            <WishlistButton />
          </Suspense>
          <Suspense
            fallback={
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/70 text-muted">
                <ShoppingCart className="h-4.5 w-4.5" />
              </div>
            }
          >
            <ShoppingCartButton />
          </Suspense>
          <ThemeSwitcher />
          <UserInfoModal />
        </div>
      </header>
    </div>
  );
};
