import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { toSafeJson } from "../../../../../prisma/funcs";
import {
  getAuthUserFromRequest,
  isAdminUser,
} from "@/shared/lib/auth";

export async function GET(req) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const user = await getAuthUserFromRequest(req);
    const isAdmin = isAdminUser(user);

    const comments = await prisma.reviews.findMany({
      where: {
        product_id: Number(searchParams.get("id")),
        // Hidden reviews are only visible to admins.
        ...(isAdmin ? {} : { isHidden: false }),
      },
      include: {
        reviews_reactions: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true
          },
        },
        ...(user
          ? {
              review_reports: {
                where: { user_id: user.id },
                select: { id: true },
              },
            }
          : {}),
      },
    });

    const safeComments = comments.map(({ review_reports, ...rest }) => ({
      ...rest,
      reportedByMe: Array.isArray(review_reports)
        ? review_reports.length > 0
        : false,
    }));

    return NextResponse.json(toSafeJson(safeComments));
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to get comments" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const comment = await prisma.reviews.create({
      data: {
        user_id: user.id,
        product_id: Number(data?.productId),
        rating: Number(data?.rating),
        comment: String(data?.comment),
      },
    });

    return NextResponse.json({ newComment: toSafeJson(comment) , status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to create the comment" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const existingComment = await prisma.reviews.findUnique({
      where: { id: Number(data?.id) },
    });

    if (!existingComment) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Admins may soft-hide/un-hide reviews without touching content.
    if (typeof data?.isHidden === "boolean") {
      if (!isAdminUser(user)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const toggled = await prisma.reviews.update({
        where: { id: Number(data?.id) },
        data: { isHidden: data.isHidden },
      });

      return NextResponse.json({ comment: toSafeJson(toggled), status: 201 });
    }

    if (existingComment.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const Comment = await prisma.reviews.update({
      where: {
        id: Number(data?.id),
      },
      data: {
        rating: Number(data?.rating),
        comment: String(data?.comment),
      },
    });

    return NextResponse.json({ comment: toSafeJson(Comment), status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to edit the comment" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const existingComment = await prisma.reviews.findUnique({
      where: { id: Number(data?.id) },
    });

    if (!existingComment) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Owner or admin may delete (reactions/reports cascade).
    if (existingComment.user_id !== user.id && !isAdminUser(user)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.reviews.delete({
      where: {
        id: Number(data?.id),
      },
    });

    return NextResponse.json({ data: "comment deleted!", status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to delete the comment" },
      { status: 500 }
    );
  }
}
