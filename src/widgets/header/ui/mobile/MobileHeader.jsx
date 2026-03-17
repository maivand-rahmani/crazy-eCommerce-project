"use client";
import React, { Suspense } from "react";
import { Home, PackageSearchIcon, ShoppingCart, Heart } from "lucide-react";
import { ShoppingCartButton, WishlistButton } from "../index";
import { useSession } from "next-auth/react";
import { UserInfoModal } from "@/entities/user";
import { NavLink } from "@/shared";

export const MobileHeader = () => {
  useSession();
  const isActiveStyle =
    "flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-button text-button-text shadow-[0_12px_30px_-18px_rgba(15,23,42,0.65)]";

  return (
    <header className="fixed inset-x-0 bottom-4 z-[9999] px-4 md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between rounded-[28px] border border-border/60 bg-background/88 px-3 py-2.5 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.75)] backdrop-blur-xl">
        <NavLink
          href="/"
          exact
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-muted transition-all duration-200 hover:bg-card hover:text-text"
          isActiveStyle={isActiveStyle}
        >
          <Home className="h-5 w-5" />
        </NavLink>
        <NavLink
          href="/catalog"
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-muted transition-all duration-200 hover:bg-card hover:text-text"
          isActiveStyle={isActiveStyle}
        >
          <PackageSearchIcon className="h-5 w-5" />
        </NavLink>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card/70 text-text shadow-sm">
          <UserInfoModal />
        </div>

        <Suspense
          fallback={
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-muted">
              <Heart className="h-5 w-5" />
            </div>
          }
        >
          <WishlistButton />
        </Suspense>
        <Suspense
          fallback={
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-muted">
              <ShoppingCart className="h-5 w-5" />
            </div>
          }
        >
          <ShoppingCartButton />
        </Suspense>
      </div>
    </header>
  );
};
