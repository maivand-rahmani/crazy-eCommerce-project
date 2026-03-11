"use client";
import React, { useState } from "react";
import { NavLink } from "@/shared";
import {
  LayoutDashboard,
  UserCog2,
  Settings,
  SquareChartGantt,
  Barcode,
  TicketPercentIcon,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: '/admin', icon: LayoutDashboard , exact: true},
  { name: "Products", path: "/admin/products", icon: Barcode, exact: false },
  { name: "Users", path: "/admin/users", icon: UserCog2, exact: false },
  { name: "Orders", path: "/admin/orders", icon: SquareChartGantt, exact: false },
  { name: "Coupons", path: "/admin/coupons", icon: TicketPercentIcon, exact: false },
  { name: "Settings", path: "/admin/settings", icon: Settings, exact: false },
];

const Sidebar = () => {
  return (
    <nav
      className={`hidden relative md:flex group shadow-xl flex-col gap-4 p-4 bg-surface text-white overflow-hidden transition-all duration-300 w-min hover:w-fit`}
    >
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          href={item.path}
          isActiveStyle="bg-accent text-primary"
          className={`flex relative items-center group-hover:justify-start rounded-2xl p-2 transition-all hover:bottom-1 shadow-xl/30`}
          exact={item.exact}
        >
          <item.icon size={30} className="text-text" />
          <span className="text-text overflow-hidden whitespace-nowrap max-w-0 group-hover:max-w-xs group-hover:ml-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
            {item.name}
          </span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Sidebar;
