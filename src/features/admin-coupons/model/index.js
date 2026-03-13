"use server";

import prisma from "../../../../prisma/client";
import { toSafeJson } from "../../../../prisma/funcs";

import {
  ADMIN_PAGE_SIZE,
  buildPagination,
  normalizeOptionalDate,
  normalizeOptionalNumber,
  normalizeText,
  parsePage,
} from "@/shared/lib";

import { ensureAdminAction } from "@/features/admin-common";
import { revalidateLocalizedPaths } from "@/shared/lib/admin/revalidate";

export async function getAdminCoupons(searchParams = {}) {
  await ensureAdminAction();

  const page = parsePage(searchParams.page);
  const query = normalizeText(searchParams.query);

  const where = {
    deleted_at: null,
    ...(query
      ? {
          coupon_code: {
            contains: query,
            mode: "insensitive",
          },
        }
      : {}),
  };

  const [total, coupons] = await Promise.all([
    prisma.coupons.count({ where }),
    prisma.coupons.findMany({
      where,
      orderBy: [{ updated_at: "desc" }, { id: "desc" }],
      skip: (page - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE,
    }),
  ]);

  return {
    coupons: toSafeJson(coupons),
    filters: { query },
    pagination: buildPagination({ total, page, pageSize: ADMIN_PAGE_SIZE }),
  };
}

export async function getAdminCouponDetail(couponId) {
  await ensureAdminAction();
  const coupon = await prisma.coupons.findUnique({ where: { id: Number(couponId) } });
  return toSafeJson(coupon);
}

export async function createCouponAction(formData) {
  await ensureAdminAction();

  const couponCode = normalizeText(formData.get("couponCode")).toUpperCase();
  const description = normalizeText(formData.get("description"));
  const type = normalizeText(formData.get("type")) || "fixed_amount";
  const value = normalizeOptionalNumber(formData.get("value"));
  const usageLimit = normalizeOptionalNumber(formData.get("usageLimit"));
  const expiresAt = normalizeOptionalDate(formData.get("expiresAt"));
  const isOneTime = formData.get("isOneTime") === "true";

  if (!couponCode || value === null) {
    throw new Error("Coupon information is incomplete.");
  }

  await prisma.coupons.create({
    data: {
      coupon_code: couponCode,
      description: description || null,
      type,
      discount_amount: type === "fixed_amount" ? value : null,
      discount_percent: type === "percentage" ? value : null,
      max_usage: usageLimit,
      is_one_time: isOneTime,
      expires_at: expiresAt,
    },
  });

  revalidateLocalizedPaths(["/admin", "/admin/coupons"]);
}

export async function updateCouponAction(formData) {
  await ensureAdminAction();

  const couponId = Number(formData.get("couponId"));
  const couponCode = normalizeText(formData.get("couponCode")).toUpperCase();
  const description = normalizeText(formData.get("description"));
  const type = normalizeText(formData.get("type")) || "fixed_amount";
  const value = normalizeOptionalNumber(formData.get("value"));
  const usageLimit = normalizeOptionalNumber(formData.get("usageLimit"));
  const expiresAt = normalizeOptionalDate(formData.get("expiresAt"));
  const isOneTime = formData.get("isOneTime") === "true";

  if (!couponId || !couponCode || value === null) {
    throw new Error("Coupon information is incomplete.");
  }

  await prisma.coupons.update({
    where: { id: couponId },
    data: {
      coupon_code: couponCode,
      description: description || null,
      type,
      discount_amount: type === "fixed_amount" ? value : null,
      discount_percent: type === "percentage" ? value : null,
      max_usage: usageLimit,
      is_one_time: isOneTime,
      expires_at: expiresAt,
    },
  });

  revalidateLocalizedPaths(["/admin", "/admin/coupons", `/admin/coupons/${couponId}`]);
}

export async function extendCouponExpirationAction(formData) {
  await ensureAdminAction();

  const couponId = Number(formData.get("couponId"));
  const expiresAt = normalizeOptionalDate(formData.get("expiresAt"));

  if (!couponId || !expiresAt) {
    throw new Error("New expiration date is required.");
  }

  await prisma.coupons.update({
    where: { id: couponId },
    data: { expires_at: expiresAt },
  });

  revalidateLocalizedPaths(["/admin", "/admin/coupons", `/admin/coupons/${couponId}`]);
}

export async function softDeleteCouponAction(formData) {
  await ensureAdminAction();

  const couponId = Number(formData.get("couponId"));

  if (!couponId) {
    throw new Error("Coupon deletion failed.");
  }

  await prisma.coupons.update({
    where: { id: couponId },
    data: { deleted_at: new Date() },
  });

  revalidateLocalizedPaths(["/admin", "/admin/coupons", `/admin/coupons/${couponId}`]);
}
