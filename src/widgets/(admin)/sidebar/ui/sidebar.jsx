"use client";
import React from "react";
import { NavLink } from "@/shared";
import {
  Box,
  LayoutDashboard,
  PackagePlus,
  ShoppingBag,
  Star,
  UserCog2,
  TicketPercentIcon,
  Settings,
} from "lucide-react";

const allNavItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard, exact: true },
  { name: "Products", path: "/admin/products", icon: Box, exact: false },
  { name: "New Product", path: "/admin/products/new", icon: PackagePlus, exact: false },
  { name: "Orders", path: "/admin/orders", icon: ShoppingBag, exact: false },
  { name: "Reviews", path: "/admin/reviews", icon: Star, exact: false },
  { name: "Users", path: "/admin/users", icon: UserCog2, exact: false, superOnly: true },
  { name: "Coupons", path: "/admin/coupons", icon: TicketPercentIcon, exact: false },
  { name: "Settings", path: "/admin/settings", icon: Settings, exact: false, superOnly: true },
];

const Sidebar = ({ role }) => {
  const isSuperAdmin = role === "super_admin";
  const navItems = allNavItems.filter((item) => !item.superOnly || isSuperAdmin);

  return (
    <>
      <nav className="sticky top-5 hidden h-[calc(100vh-40px)] w-[260px] shrink-0 flex-col gap-2 overflow-hidden rounded-2xl border border-border/65 bg-card p-4 shadow-[var(--admin-shadow)] md:flex">
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto pr-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              href={item.path}
              isActiveStyle="bg-primary/10 text-primary border-primary/20"
              className="group flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-text transition duration-200 hover:bg-primary/5 hover:text-primary"
              exact={item.exact}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-muted/40 text-text transition duration-200 group-hover:bg-primary/10 group-hover:text-primary">
                <item.icon size={18} />
              </div>
              <span className="whitespace-nowrap text-[14px] font-medium tracking-[-0.02em]">
                {item.name}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>
      <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-border/65 bg-card p-2 shadow-[var(--admin-shadow)] md:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            href={item.path}
            isActiveStyle="bg-primary/10 text-primary"
            className="flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium text-text transition duration-200 hover:bg-primary/5"
            exact={item.exact}
          >
            <item.icon size={16} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
