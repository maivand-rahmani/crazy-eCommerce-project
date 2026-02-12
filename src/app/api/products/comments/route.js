import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { toSafeJson } from "../../../../../prisma/funcs";

export async function GET(req) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const comments = await prisma.reviews.findMany({
      where: { product_id: Number(searchParams.get("id")) },
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
      },
    });

    return NextResponse.json(toSafeJson(comments));
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
    const data = await req.json();

    const comment = await prisma.reviews.create({
      data: {
        user_id: data?.user_id,
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
    const data = await req.json();

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
  const data = await req.json();
  try {
    const comment = await prisma.reviews.delete({
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
