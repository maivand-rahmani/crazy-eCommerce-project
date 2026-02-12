import React from "react";
import CommentSection from "./CommentSection/CommentSection";
import Fetch from "@/shared/lib/fetch";
import { getServerSession } from 'next-auth'
import { authParams } from "@/app/api/auth/[...nextauth]/route";


const MainCommentComponent = async ({ productID }) => {
  const user = await getServerSession(authParams).then((res) => res?.user);
  const data = await Fetch(`/api/products/comments?id=${productID}`);

  const serializedComments = data.map((c) => ({
    ...c,
    likes: c.reviews_reactions.filter((r) => r.type === "like").length,
    dislikes: c.reviews_reactions.filter((r) => r.type === "dislike").length,
    userReaction: user
      ? c.reviews_reactions.find((r) => r.user_id === user.id)?.type
      : null,
  }));

  
  return (
    <div>
      <CommentSection
        initialComments={serializedComments}
        productID={productID}
      />
    </div>
  );
};

export default MainCommentComponent;
