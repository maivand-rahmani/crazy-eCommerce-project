"use client"
import React, { useState } from "react";
import CommentComponent from '../client/CommentComponent';
import { CommentForm } from "../CommentAdding/CommentForm";
 

const CommentSection = ({ productID , initialProducts , users }) => {
  const [comments, setComments] = useState(initialProducts);

  const handleAddComment = (newComment) => {
    const user = users.find(u => u.id === newComment.user_id);
    setComments((prev) => [{...newComment , user}, ...prev]);
  };

  return (
    <div className="rounded-3xl bg-gray-200 shadow-2xl p-4">
      <div>
        <CommentForm product_id={productID} onAddComment={handleAddComment}/>
      </div>
      <div className="flex flex-col gap-5">
        {comments &&
          comments.map((comment) => (
            <CommentComponent key={comment.id} comment={comment} user={comment.user} />
          ))}
      </div>
    </div>
  );
};

export default CommentSection;
