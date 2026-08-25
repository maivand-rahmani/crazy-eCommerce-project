"use client";
import React from "react";
import { NavLink } from "@/shared";
import {
  Box,
  LayoutDashboard,
  PackagePlus,
  ShoppingBag,
  UserCog2,
  TicketPercentIcon,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard, exact: true },
  { name: "Products", path: "/admin/products", icon: Box, exact: false },
  { name: "New Product", path: "/admin/products/new", icon: PackagePlus, exact: false },
  { name: "Orders", path: "/admin/orders", icon: ShoppingBag, exact: false },
  { name: "Users", path: "/admin/users", icon: UserCog2, exact: false },
  { name: "Coupons", path: "/admin/coupons", icon: TicketPercentIcon, exact: false },
];

const Sidebar = () => {
  return (
    <nav
      className="sticky top-5 hidden h-[calc(100vh-40px)] w-[260px] shrink-0 flex-col gap-4 overflow-hidden rounded-[34px] border border-[color:var(--admin-nav-border)] bg-[linear-gradient(180deg,rgba(12,12,12,0.94),rgba(24,24,24,0.92))] p-4 shadow-[0_38px_85px_-42px_rgba(0,0,0,0.82)] backdrop-blur-[28px] md:flex"
    >
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            href={item.path}
            isActiveStyle="border-[#c9983b]/35 bg-[#c9983b]/10 text-stone-50 shadow-[0_20px_34px_-24px_rgba(201,152,59,0.28)]"
            className="group flex items-center gap-3 rounded-[20px] border border-transparent px-4 py-3 text-stone-300 transition duration-200 hover:border-white/10 hover:bg-white/[0.05]"
            exact={item.exact}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] bg-white/[0.07] text-stone-100 transition duration-200 group-hover:bg-[#c9983b]/14 group-hover:text-[#f3d899]">
              <item.icon size={18} />
            </div>
            <span className="whitespace-nowrap text-[14px] font-medium tracking-[-0.02em]">
              {item.name}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
