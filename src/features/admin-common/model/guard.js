"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/features/auth/model/authOptions";
import { localizePath } from "@/shared/lib/admin/paths";
import { isAdmin, isSuperAdmin } from "@/shared/lib/auth/roles";

export async function getAdminSessionUser() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}

export async function requireAdminSession() {
  const user = await getAdminSessionUser();

  if (!isAdmin(user)) {
    throw new Error("Unauthorized admin action.");
  }

  return user;
}

export async function requireSuperAdminSession() {
  const user = await getAdminSessionUser();

  if (!isSuperAdmin(user)) {
    throw new Error("Unauthorized super_admin action.");
  }

  return user;
}

export async function requireAdminPage(locale) {
  const user = await getAdminSessionUser();

  if (!user) {
    redirect(`${localizePath(locale, "/auth")}?redirectTo=${encodeURIComponent(localizePath(locale, "/admin"))}`);
  }

  if (!isAdmin(user)) {
    redirect(localizePath(locale, "/"));
  }

  return user;
}

export async function requireSuperAdminPage(locale) {
  const user = await getAdminSessionUser();

  if (!user) {
    redirect(`${localizePath(locale, "/auth")}?redirectTo=${encodeURIComponent(localizePath(locale, "/admin"))}`);
  }

  if (!isSuperAdmin(user)) {
    redirect(localizePath(locale, "/"));
  }

  return user;
}

export async function ensureAdminAction() {
  return requireAdminSession();
}

export async function ensureSuperAdminAction() {
  return requireSuperAdminSession();
}
