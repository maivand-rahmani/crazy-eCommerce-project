"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ href, children , className}) => {
  const pathname = usePathname();
  const isActive = pathname == href; 

  return (
    <Link
      href={href}
      className={`${isActive ? "relative w-8 h-8 scale-250 bottom-4 rounded-full flex center text-primary-text bg-primary shadow-2xl animate-get-out" : ""} ${className} `}
    >
      {children}
    </Link>
  );
};

export default NavLink;
