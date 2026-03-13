"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/features/auth/model/authOptions";
import { localizePath } from "@/shared/lib/admin/paths";

export async function getAdminSessionUser() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}

export async function requireAdminSession() {
  const user = await getAdminSessionUser();

  if (!user || user.deletedAt || user.isBlocked || user.role !== "admin") {
    throw new Error("Unauthorized admin action.");
  }

  return user;
}

export async function requireAdminPage(locale) {
  const user = await getAdminSessionUser();

  if (!user) {
    redirect(`${localizePath(locale, "/auth")}?redirectTo=${encodeURIComponent(localizePath(locale, "/admin"))}`);
  }

  if (user.deletedAt || user.isBlocked || user.role !== "admin") {
    redirect(localizePath(locale, "/"));
  }

  return user;
}

export async function ensureAdminAction() {
  return requireAdminSession();
}
