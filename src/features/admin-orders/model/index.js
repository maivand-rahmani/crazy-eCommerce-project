"use server";

import prisma from "../../../../prisma/client";
import { toSafeJson } from "../../../../prisma/funcs";

import {
  ADMIN_PAGE_SIZE,
  buildPagination,
  normalizeOptionalDate,
  normalizeText,
  parsePage,
} from "@/shared/lib";

import { ensureAdminAction } from "@/features/admin-common";
import { revalidateLocalizedPaths } from "@/shared/lib/admin/revalidate";

export async function getAdminOrders(searchParams = {}) {
  await ensureAdminAction();

  const page = parsePage(searchParams.page);
  const query = normalizeText(searchParams.query);
  const status = normalizeText(searchParams.status);
  const userQuery = normalizeText(searchParams.user);
  const dateFrom = normalizeOptionalDate(searchParams.dateFrom);
  const dateTo = normalizeOptionalDate(searchParams.dateTo);

  const where = {
    ...(status ? { status } : {}),
    ...(query
      ? {
          id: {
            contains: query,
            mode: "insensitive",
          },
        }
      : {}),
    ...(dateFrom || dateTo
      ? {
          created_at: {
            ...(dateFrom ? { gte: dateFrom } : {}),
            ...(dateTo ? { lte: new Date(dateTo.getTime() + 24 * 60 * 60 * 1000) } : {}),
          },
        }
      : {}),
    ...(userQuery
      ? {
          user: {
            OR: [
              { name: { contains: userQuery, mode: "insensitive" } },
              { email: { contains: userQuery, mode: "insensitive" } },
            ],
          },
        }
      : {}),
  };

  const [total, orders] = await Promise.all([
    prisma.orders.count({ where }),
    prisma.orders.findMany({
      where,
      orderBy: [{ created_at: "desc" }, { id: "desc" }],
      skip: (page - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        coupons: true,
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
    }),
  ]);

  return {
    orders: orders.map((order) => ({
      id: order.id,
      status: order.status,
      totalCents: order.total_cents,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      customerName: order.user?.name || order.user?.email || "Guest",
      customerEmail: order.user?.email || "-",
      itemsCount: order.order_items.reduce((sum, item) => sum + item.quantity, 0),
      returnStatus: order.return_status,
    })),
    filters: {
      query,
      status,
      user: userQuery,
      dateFrom: searchParams.dateFrom || "",
      dateTo: searchParams.dateTo || "",
    },
    pagination: buildPagination({ total, page, pageSize: ADMIN_PAGE_SIZE }),
  };
}

export async function getAdminOrderDetail(orderId) {
  await ensureAdminAction();

  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    include: {
      coupons: true,
      user: true,
      order_items: {
        include: {
          product_variants: {
            include: {
              products: {
                include: {
                  categories: true,
                  product_images: {
                    orderBy: [{ position: "asc" }, { id: "asc" }],
                    take: 1,
                  },
                },
              },
              variant_options: true,
            },
          },
        },
      },
    },
  });

  return toSafeJson(order);
}

export async function updateOrderStatusAction(formData) {
  await ensureAdminAction();

  const orderId = normalizeText(formData.get("orderId"));
  const status = normalizeText(formData.get("status"));

  if (!orderId || !status) {
    throw new Error("Order status update failed.");
  }

  await prisma.orders.update({
    where: { id: orderId },
    data: { status },
  });

  revalidateLocalizedPaths(["/admin", "/admin/orders", `/admin/orders/${orderId}`]);
}

export async function updateOrderReturnAction(formData) {
  await ensureAdminAction();

  const orderId = normalizeText(formData.get("orderId"));
  const returnStatus = normalizeText(formData.get("returnStatus"));
  const returnReason = normalizeText(formData.get("returnReason"));

  if (!orderId || !returnStatus) {
    throw new Error("Return processing failed.");
  }

  await prisma.orders.update({
    where: { id: orderId },
    data: {
      return_requested: returnStatus !== "none",
      return_status: returnStatus,
      return_reason: returnReason || null,
      returned_at: returnStatus === "processed" ? new Date() : null,
    },
  });

  revalidateLocalizedPaths(["/admin", "/admin/orders", `/admin/orders/${orderId}`]);
}
