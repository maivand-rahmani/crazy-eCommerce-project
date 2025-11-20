import React from "react";
import CommentSection from "./CommentSection/CommentSection";
import Fetch from "@/funcs/fetch";
import { clerkClient , currentUser } from "@clerk/nextjs/server";

function serializeUsers(users) {
  return users.data.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    imageUrl: user.imageUrl,
  }));
}

const MainCommentComponent = async ({ productID }) => {
  const user = await currentUser()
  const data = await Fetch(`/api/products/comments?id=${productID}`);

  const serializedComments = data.map((c) => ({
    ...c,
    likes: c.reviews_reactions.filter((r) => r.type === "like").length,
    dislikes: c.reviews_reactions.filter((r) => r.type === "dislike").length,
    userReaction:
      c.reviews_reactions.find((r) => r.user_id === user.id)?.type || null,
  }));

  const ids = [...new Set(data.map((c) => c.user_id))];

  const client = await clerkClient();
  const users = await client.users.getUserList({
    userId: ids,
    limit: 100,
  });

  const serializedUsers = serializeUsers(users);

  const commentsWithUsers = serializedComments.map((comment) => {
    const user = serializedUsers.find((u) => u.id === comment.user_id);
    return { ...comment, user: user };
  });

 

  return (
    <div>
      <CommentSection
        initialComments={commentsWithUsers}
        productID={productID}
        users={serializedUsers}
      />
    </div>
  );
};

export default MainCommentComponent;
