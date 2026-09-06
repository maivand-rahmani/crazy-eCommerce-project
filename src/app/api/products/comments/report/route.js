import { NextResponse } from "next/server";

import prisma from "../../../../../../prisma/client";
import { getAuthUserFromRequest } from "@/shared/lib/auth";

const MAX_REASON_LENGTH = 500;

/**
 * POST /api/products/comments/report { reviewId, reason? }
 * Upserts a report for the authenticated user on a review.
 */
export async function POST(req) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (user.isBlocked || user.deletedAt) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json().catch(() => null);
    const reviewId = Number(data?.reviewId);

    if (!Number.isInteger(reviewId) || reviewId <= 0) {
      return NextResponse.json(
        { error: "A valid reviewId is required." },
        { status: 400 },
      );
    }

    const rawReason = data?.reason == null ? "" : String(data.reason);
    const reason = rawReason.trim();

    if (reason.length > MAX_REASON_LENGTH) {
      return NextResponse.json(
        { error: `Reason must be ${MAX_REASON_LENGTH} characters or fewer.` },
        { status: 400 },
      );
    }

    const review = await prisma.reviews.findUnique({
      where: { id: reviewId },
      select: { id: true, user_id: true },
    });

    if (!review) {
      return NextResponse.json(
        { error: "Review not found." },
        { status: 404 },
      );
    }

    if (review.user_id === user.id) {
      return NextResponse.json(
        { error: "You cannot report your own review." },
        { status: 403 },
      );
    }

    const report = await prisma.review_reports.upsert({
      where: { review_id_user_id: { review_id: reviewId, user_id: user.id } },
      update: { reason },
      create: { review_id: reviewId, user_id: user.id, reason },
    });

    return NextResponse.json({ report: { id: Number(report.id) }, status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to report the review" },
      { status: 500 },
    );
  }
}
