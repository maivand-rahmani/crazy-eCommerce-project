"use server";

import prisma from "../../../../prisma/client";
import { toSafeJson } from "../../../../prisma/funcs";

import {
  ADMIN_PAGE_SIZE,
  buildPagination,
  normalizeText,
  parsePage,
} from "@/shared/lib";

import { ensureAdminAction } from "@/features/admin-common";
import { revalidateLocalizedPaths } from "@/shared/lib/admin/revalidate";

export async function getAdminUsers(searchParams = {}) {
  await ensureAdminAction();

  const page = parsePage(searchParams.page);
  const query = normalizeText(searchParams.query);
  const role = normalizeText(searchParams.role);
  const blocked = normalizeText(searchParams.blocked);

  const where = {
    ...(query
      ? {
          email: {
            contains: query,
            mode: "insensitive",
          },
        }
      : {}),
    ...(role ? { role } : {}),
    ...(blocked === "blocked"
      ? { isBlocked: true }
      : blocked === "active"
        ? { isBlocked: false }
        : {}),
  };

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE,
      include: {
        orders: {
          orderBy: { created_at: "desc" },
          select: {
            created_at: true,
          },
        },
      },
    }),
  ]);

  return {
    users: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
      deletedAt: user.deletedAt,
      createdAt: user.createdAt,
      ordersCount: user.orders.length,
      lastOrderAt: user.orders[0]?.created_at || null,
    })),
    filters: {
      query,
      role,
      blocked,
    },
    pagination: buildPagination({ total, page, pageSize: ADMIN_PAGE_SIZE }),
  };
}

export async function getAdminUserDetail(userId) {
  await ensureAdminAction();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          orders: true,
        },
      },
      orders: {
        orderBy: { created_at: "desc" },
        include: {
          order_items: {
            include: {
              product_variants: {
                include: {
                  products: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return toSafeJson({
    ...user,
    ordersCount: user?._count?.orders || 0,
  });
}

export async function updateUserRoleAction(formData) {
  await ensureAdminAction();

  const userId = normalizeText(formData.get("userId"));
  const role = normalizeText(formData.get("role"));

  if (!userId || !role) {
    throw new Error("Role update failed.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidateLocalizedPaths(["/admin", "/admin/users", `/admin/users/${userId}`]);
}

export async function updateUserBlockAction(formData) {
  await ensureAdminAction();

  const userId = normalizeText(formData.get("userId"));
  const isBlocked = formData.get("isBlocked") === "true";

  if (!userId) {
    throw new Error("User state update failed.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { isBlocked },
  });

  revalidateLocalizedPaths(["/admin", "/admin/users", `/admin/users/${userId}`]);
}

export async function softDeleteUserAction(formData) {
  await ensureAdminAction();

  const userId = normalizeText(formData.get("userId"));

  if (!userId) {
    throw new Error("User removal failed.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      deletedAt: new Date(),
      isBlocked: true,
    },
  });

  revalidateLocalizedPaths(["/admin", "/admin/users", `/admin/users/${userId}`]);
}
