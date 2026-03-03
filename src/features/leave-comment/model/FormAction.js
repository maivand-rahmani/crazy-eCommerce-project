"use server";
import { getServerSession } from "next-auth";
import { authParams } from "@/app/api/auth/[...nextauth]/route";
import { Fetch } from "@/shared/lib";

export async function CommentAction(formData) {

  const session = await getServerSession(authParams);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const response = await Fetch("/api/products/comments", "POST" , {
    comment: formData.get("comment"),
    rating: Number(formData.get("rating")),
    productId: Number(formData.get("productId")),
    user_id: session.user.id,
  });

  return response;
}