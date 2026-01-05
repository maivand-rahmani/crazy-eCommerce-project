"use client"
import React, { useState } from "react";
import CommentComponent from '../client/CommentComponent';
import { CommentForm } from "../CommentAdding/CommentForm";
import { SignedIn , SignedOut , SignInButton , SignUpButton } from "@clerk/nextjs";
 

const CommentSection = ({ productID , initialComments , users }) => {
  const [comments, setComments] = useState(initialComments);

   console.log(comments)

  const handleAddComment = (newComment) => {
    const user = users.find(u => u.id === newComment.user_id);
    setComments((prev) => [{...newComment , user}, ...prev]);
  };

  const handleDeleteComment = ( commentId ) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  }

  const handleEditing = (editedComment) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === editedComment.id ? { ...comment, ...editedComment } : comment
      )
    );
  }

  

  return (
    <div className="rounded-3xl bg-gray-200 shadow-2xl p-4 my-5">
      <SignedIn>
        <CommentForm product_id={productID} onAddComment={handleAddComment}/>
      </SignedIn>
      <SignedOut>
        <div className="flex center flex-col">
          <div className="text-2xl font-extrabold">To leave a comment please sign in</div>
          <div className="flex gap-5">
            <SignInButton className="btn rounded-2xl bg-white text-black" mode="modal"/> 
            <SignUpButton className="btn rounded-2xl bg-black" mode="modal" />
          </div>
        </div>
      </SignedOut>
      <div className="flex flex-col gap-5">
        {comments &&
          comments.map((comment) => (
            <CommentComponent handleDelete={handleDeleteComment} handleEdit={handleEditing} key={comment.id} comment={comment} user={comment.user}  />
          ))}
      </div>
    </div>
  );
};

export default CommentSection;
