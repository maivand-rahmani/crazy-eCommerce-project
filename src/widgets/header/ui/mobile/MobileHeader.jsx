"use client";
import React, { Suspense } from "react";
import {
  Home,
  PackageSearchIcon,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { ShoppingCartButton, WishlistButton } from "../index";
import { useSession } from "next-auth/react";
import { UserInfoModal } from "@/entities/user";
import { NavLink } from "@/shared";

export const MobileHeader = () => {
  const session = useSession();
  const user = session.data;
  const isActiveStyle = "relative w-8 h-8 scale-250 bottom-4 rounded-full flex center text-primary-text bg-primary shadow-2xl animate-get-out";

  return (
    <header className="fixed w-[-webkit-fill-available] border border-border bg-surface m-5 rounded-full px-7 py-3 flex z-9999 justify-between bottom-0  shadow-3xl-black md:hidden">
      <NavLink href={"/"} className={``} isActiveStyle={isActiveStyle}>
        <Home />
      </NavLink>
      <NavLink href={"/catalog"} className={``} isActiveStyle={isActiveStyle}>
        <PackageSearchIcon />
      </NavLink>
      {user && <UserInfoModal />}

      <NavLink href={"/wishlist"} className={``} isActiveStyle={isActiveStyle}>
        <Suspense fallback={<Heart />}>
          <WishlistButton />
        </Suspense>
      </NavLink>
      <NavLink href={"/cart"} className={``} isActiveStyle={isActiveStyle}>
        <Suspense fallback={<ShoppingCart />}>
          <ShoppingCartButton />
        </Suspense>
      </NavLink>
    </header>
  );
};