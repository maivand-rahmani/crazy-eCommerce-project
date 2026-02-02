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
import { SignUpButton, SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import NavLink from "../ui/NavLink";
import CustomUserButton from '../ui/CustomUserButton'

const MobileHeader = () => {
  return (
    <header className="fixed w-[-webkit-fill-available] border border-gray-500 bg-white m-5 rounded-full px-7 py-3 flex z-9999 justify-between bottom-0  shadow-3xl-black md:hidden">
      <NavLink href={"/"} className={``}>
        <Home />
      </NavLink>
      <NavLink href={"/catalog"} className={``}>
        <PackageSearchIcon />
      </NavLink>
      
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
