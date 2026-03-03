"use client";
import React from "react";
import {
  Home,
  PackageSearchIcon,
  ShoppingCart,
  Heart,
  CircleUserRound,
  Settings,
} from "lucide-react";
import NavLink from "../ui/NavLink";
import { useSession } from "next-auth/react";
import { UserInfoModal } from "@/entities/user";

const MobileHeader = () => {
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
      {user && <UserInfoModal />}

      <NavLink href={"/wishlist"} className={``}>
        <Heart />
      </NavLink>
      <NavLink href={"/cart"} className={``}>
        <ShoppingCart />
      </NavLink>
    </header>
  );
};

export default MobileHeader;
