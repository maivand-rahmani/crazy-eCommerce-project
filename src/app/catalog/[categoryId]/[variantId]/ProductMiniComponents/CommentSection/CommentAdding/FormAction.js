"use server";
import { auth } from "@clerk/nextjs/server";
import Fetch from "../../../../../../../../funcs/fetch";

export async function CommentAction(formData) {
  const { getToken, userId } = await auth();
  const token = await getToken();

  console.log(formData)

  const response = await Fetch("/api/products/comments", "POST", token, {
    comment: formData.get("comment"),
    rating: formData.get("rating"),
    productId: formData.get("productId"),
    user_id: userId,
  });

 
  return response; 
}
