"use client";
import React from "react";
import { Link, usePathname } from "@/shared/i18n";

const NavLink = ({
  href,
  children,
  className,
  isActiveStyle,
  exact = false,
}) => {
  const pathname = usePathname();
  const isRoot = href === "/";
  const isActive =
    exact || isRoot
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`${isActive ? isActiveStyle : ""} ${className} `}
    >
      {children}
    </Link>
  );
};

export default NavLink;
