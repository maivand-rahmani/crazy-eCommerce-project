"use server";

import prisma from "../../../../prisma/client";

import { buildPagination, parsePage } from "@/shared/lib";
import { DEFAULT_SETTINGS } from "@/features/admin-settings/model/defaults";

import { ensureAdminAction } from "@/features/admin-common";
import { revalidateLocalizedPaths } from "@/shared/lib/admin/revalidate";

async function resolvePageSize() {
  let pageSize = DEFAULT_SETTINGS["admin.pageSize"];
  try {
    const { getSettings } = await import("@/features/admin-settings/model/settings");
    const s = await getSettings();
    pageSize = Number(s["admin.pageSize"] ?? pageSize);
  } catch {}
  return Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10;
}

export async function getAdminReviews(searchParams = {}) {
  await ensureAdminAction();

  const page = parsePage(searchParams.page);
  const pageSize = await resolvePageSize();
  const status = searchParams.status === "hidden" ? "hidden" : searchParams.status === "visible" ? "visible" : "";
  const query = typeof searchParams.query === "string" ? searchParams.query.trim() : "";

  const where = {
    ...(status === "hidden" ? { isHidden: true } : {}),
    ...(status === "visible" ? { isHidden: false } : {}),
    ...(query
      ? {
          OR: [
            { comment: { contains: query, mode: "insensitive" } },
            { user: { email: { contains: query, mode: "insensitive" } } },
            { user: { name: { contains: query, mode: "insensitive" } } },
            { product: { name: { contains: query, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const [total, reviews] = await Promise.all([
    prisma.reviews.count({ where }),
    prisma.reviews.findMany({
      where,
      orderBy: [{ created_at: "desc" }, { id: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true } },
        _count: { select: { review_reports: true } },
        review_reports: {
          orderBy: [{ created_at: "desc" }],
          take: 1,
          select: { reason: true, created_at: true },
        },
      },
    }),
  ]);

  return {
    reviews: reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      isHidden: review.isHidden,
      createdAt: review.created_at,
      productName: review.product?.name || "-",
      productId: review.product?.id ? String(review.product.id) : null,
      userName: review.user?.name || review.user?.email || "-",
      userEmail: review.user?.email || "-",
      reportsCount: review._count?.review_reports ?? 0,
      latestReportReason: review.review_reports?.[0]?.reason || null,
      latestReportAt: review.review_reports?.[0]?.created_at || null,
    })),
    filters: { status, query },
    pagination: buildPagination({ total, page, pageSize }),
  };
}

async function writeModerationAudit(key, oldValue, newValue, changedBy) {
  await prisma.settingsAuditLog.create({
    data: { key, oldValue, newValue, changedBy },
  });
}

export async function toggleReviewHiddenAction(formData) {
  const user = await ensureAdminAction();

  const reviewId = Number(formData.get("reviewId"));
  const isHidden = formData.get("isHidden") === "true";

  if (!Number.isInteger(reviewId) || reviewId <= 0) {
    throw new Error("Review moderation failed.");
  }

  const existing = await prisma.reviews.findUnique({
    where: { id: reviewId },
    select: { id: true, isHidden: true },
  });

  if (!existing) {
    throw new Error("Review not found.");
  }

  await prisma.reviews.update({
    where: { id: reviewId },
    data: { isHidden },
  });

  await writeModerationAudit(
    `review.${isHidden ? "hide" : "unhide"}:${reviewId}`,
    { isHidden: existing.isHidden },
    { isHidden },
    user.id,
  );

  revalidateLocalizedPaths(["/admin/reviews"]);
}

export async function deleteReviewAction(formData) {
  const user = await ensureAdminAction();

  const reviewId = Number(formData.get("reviewId"));

  if (!Number.isInteger(reviewId) || reviewId <= 0) {
    throw new Error("Review deletion failed.");
  }

  const existing = await prisma.reviews.findUnique({
    where: { id: reviewId },
    select: { id: true, user_id: true, product_id: true, rating: true, comment: true },
  });

  if (!existing) {
    throw new Error("Review not found.");
  }

  // Real delete; reactions and reports cascade via FK constraints.
  await prisma.reviews.delete({ where: { id: reviewId } });

  await writeModerationAudit(
    `review.delete:${reviewId}`,
    {
      userId: existing.user_id,
      productId: String(existing.product_id),
      rating: existing.rating,
      comment: existing.comment,
    },
    null,
    user.id,
  );

  revalidateLocalizedPaths(["/admin/reviews"]);
}
