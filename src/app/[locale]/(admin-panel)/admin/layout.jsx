import React from "react";

import { requireAdminPage } from "@/features/admin-common";
import { AdminShell } from "@/widgets/(admin)/admin-shell";

export const metadata = {
  title: "Admin Panel | Cyber",
  description: "Internal administration surface for managing products, orders, users, and coupons.",
  robots: "noindex, nofollow",
};

export default async function AdminLayout({ children, params }) {
  const { locale } = await params;
  const user = await requireAdminPage(locale);

  return <AdminShell user={user}>{children}</AdminShell>;
}
