"use client";
import React from "react";
import { NavLink } from "@/shared";
import {
  ArrowUpRight,
  Box,
  LayoutDashboard,
  Monitor,
  PackagePlus,
  ShoppingBag,
  UserCog2,
  SquareChartGantt,
  TicketPercentIcon,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard, exact: true },
  { name: "Products", path: "/admin/products", icon: Box, exact: false },
  { name: "New Product", path: "/admin/products/new", icon: PackagePlus, exact: false },
  { name: "Orders", path: "/admin/orders", icon: ShoppingBag, exact: false },
  { name: "Users", path: "/admin/users", icon: UserCog2, exact: false },
  { name: "Coupons", path: "/admin/coupons", icon: TicketPercentIcon, exact: false },
  { name: "Desktop Info", path: "/admin/desktop-only", icon: Monitor, exact: false },
];

const Sidebar = () => {
  return (
    <nav
      className="sticky top-5 hidden h-[calc(100vh-40px)] w-[286px] shrink-0 flex-col gap-6 overflow-hidden rounded-[34px] border border-[color:var(--admin-nav-border)] bg-[linear-gradient(180deg,rgba(12,12,12,0.94),rgba(24,24,24,0.92))] p-5 shadow-[0_38px_85px_-42px_rgba(0,0,0,0.82)] backdrop-blur-[28px] md:flex"
    >
      <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-4">
        <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-[24px] bg-[linear-gradient(135deg,#f5e7c1,#c9983b)] text-stone-950 shadow-[0_18px_38px_-20px_rgba(201,152,59,0.5)]">
          <LayoutDashboard className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="font-admin-code text-[11px] uppercase tracking-[0.26em] text-stone-500">
            Private workspace
          </p>
          <p className="mt-1 text-[15px] font-semibold tracking-[-0.03em] text-stone-50">Cyber Atelier</p>
          <p className="mt-2 max-w-[170px] text-xs leading-5 text-stone-400">
            Luxury minimal operations for catalog, fulfillment, and customer care.
          </p>
        </div>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-[22px] border border-white/8 bg-white/[0.04] px-3.5 py-3">
          <div>
            <p className="font-admin-code text-[10px] uppercase tracking-[0.24em] text-stone-500">Focus</p>
            <p className="mt-1 text-sm font-medium text-stone-100">Desktop admin only</p>
          </div>
          <ArrowUpRight className="h-4 w-4 text-[#c9983b]" />
        </div>
      </div>
      <div className="px-1">
        <p className="font-admin-code text-[10px] uppercase tracking-[0.26em] text-stone-500">Navigation</p>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto pr-1">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          href={item.path}
          isActiveStyle="border-[#c9983b]/35 bg-[#c9983b]/10 text-stone-50 shadow-[0_20px_34px_-24px_rgba(201,152,59,0.28)]"
          className="group flex items-center gap-3 rounded-[24px] border border-transparent px-4 py-3.5 text-stone-300 transition duration-200 hover:border-white/10 hover:bg-white/[0.05]"
          exact={item.exact}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] bg-white/[0.07] text-stone-100 transition duration-200 group-hover:bg-[#c9983b]/14 group-hover:text-[#f3d899]">
            <item.icon size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block whitespace-nowrap text-[15px] font-medium tracking-[-0.02em]">
            {item.name}
            </span>
            <span className="mt-0.5 block whitespace-nowrap text-[11px] uppercase tracking-[0.18em] text-stone-500">
              {item.path.replace("/admin", "") || "/overview"}
            </span>
          </div>
        </NavLink>
      ))}
      </div>
      <div className="mt-auto rounded-[26px] border border-white/10 bg-white/[0.045] p-4 text-xs text-stone-300">
        <p className="font-admin-code uppercase tracking-[0.24em] text-stone-500">Why this layout</p>
        <p className="mt-2 leading-6 text-stone-400">
          Wider navigation keeps labels visible, reduces visual friction, and lets the content breathe instead of feeling packed.
        </p>
      </div>
    </nav>
  );
};

export default Sidebar;
