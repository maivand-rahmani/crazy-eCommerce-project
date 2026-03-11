"use client";
import React, { Suspense } from "react";
import {
  Home,
  PackageSearchIcon,
  ShoppingCart,
  Heart,
  CircleUserRound,
  Settings,
} from "lucide-react";
import { NavLink, ShoppingCartButton, WishlistButton } from "../index";
import { useSession } from "next-auth/react";
import { UserInfoModal } from "@/entities/user";

export const MobileHeader = () => {
  const session = useSession();
  const user = session.data;

  return (
    <header className="fixed w-[-webkit-fill-available] border border-border bg-surface m-5 rounded-full px-7 py-3 flex z-9999 justify-between bottom-0  shadow-3xl-black md:hidden">
      <NavLink href={"/"} className={``}>
        <Home />
      </NavLink>
      <NavLink href={"/catalog"} className={``}>
        <PackageSearchIcon />
      </NavLink>
      <UserInfoModal />

      <NavLink href={"/wishlist"} className={``}>
        <Suspense fallback={<Heart />}>
          <WishlistButton />
        </Suspense>
      </NavLink>
      <NavLink href={"/cart"} className={``}>
        <Suspense fallback={<ShoppingCart />}>
          <ShoppingCartButton />
        </Suspense>
      </NavLink>
    </header>
  );
};