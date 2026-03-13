"use server";

import prisma from "../../../../prisma/client";
import { toSafeJson } from "../../../../prisma/funcs";

import {
  LOW_STOCK_THRESHOLD,
  SALES_WINDOW_DAYS,
  formatCurrency,
  formatDate,
} from "@/shared/lib";
import { ensureAdminAction } from "@/features/admin-common";
import { revalidateLocalizedPaths } from "@/shared/lib/admin/revalidate";

export async function getAdminDashboardData() {
  await ensureAdminAction();

  const [
    totalOrders,
    totalUsers,
    totalProducts,
    lowStockProducts,
    latestOrders,
    lowStockVariants,
    salesOrders,
  ] = await Promise.all([
    prisma.orders.count(),
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.products.count({ where: { deleted_at: null } }),
    prisma.product_variants.count({
      where: {
        deleted_at: null,
        stock_quantity: { lte: LOW_STOCK_THRESHOLD },
        status: "active",
      },
    }),
    prisma.orders.findMany({
      orderBy: { created_at: "desc" },
      take: 6,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        order_items: true,
      },
    }),
    prisma.product_variants.findMany({
      where: {
        deleted_at: null,
        stock_quantity: { lte: LOW_STOCK_THRESHOLD },
        status: "active",
      },
      orderBy: [{ stock_quantity: "asc" }, { updated_at: "desc" }],
      take: 6,
      include: {
        products: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    }),
    prisma.orders.findMany({
      where: {
        status: {
          in: ["paid", "shipped", "delivered"],
        },
        created_at: {
          gte: new Date(Date.now() - SALES_WINDOW_DAYS * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { created_at: "asc" },
      select: {
        created_at: true,
        total_cents: true,
      },
    }),
  ]);

  const salesMap = new Map();

  salesOrders.forEach((order) => {
    const key = formatDate(order.created_at, {
      month: "short",
      day: "numeric",
    });
    const current = salesMap.get(key) || { label: key, sales: 0, orders: 0 };
    current.sales += Number(order.total_cents || 0) / 100;
    current.orders += 1;
    salesMap.set(key, current);
  });

  const salesSeries = Array.from(salesMap.values());
  const recentRevenueCents = salesOrders.reduce(
    (sum, order) => sum + Number(order.total_cents || 0),
    0,
  );

  return {
    summary: {
      totalOrders,
      totalUsers,
      totalProducts,
      lowStockProducts,
      recentRevenueLabel: formatCurrency(recentRevenueCents),
    },
    salesSeries: salesSeries.length
      ? salesSeries
      : [{ label: "No sales", sales: 0, orders: 0 }],
    latestOrders: latestOrders.map((order) => ({
      id: order.id,
      createdAt: order.created_at,
      status: order.status,
      totalCents: order.total_cents,
      userName: order.user?.name || order.user?.email || "Guest",
      itemsCount: order.order_items.reduce((sum, item) => sum + item.quantity, 0),
    })),
    lowStockVariants: toSafeJson(lowStockVariants.map((variant) => ({
      id: variant.id,
      productId: variant.product_id,
      productName: variant.products?.name || "Unknown product",
      variantName: variant.variant_name || "Default variant",
      stockQuantity: variant.stock_quantity,
      status: variant.status,
      updatedAt: variant.updated_at,
    }))),
  };
}

export async function revalidateAdminDashboard() {
  revalidateLocalizedPaths(["/admin"]);
}
