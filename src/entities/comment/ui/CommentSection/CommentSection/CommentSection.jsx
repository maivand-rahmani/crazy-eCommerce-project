"use client";
import React, { useState } from "react";
import CommentComponent from "../client/CommentComponent";
import { CommentForm } from "../../../../../features/leave-comment/ui/CommentForm";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const CommentSection = ({ productID, initialComments }) => {
  const t = useTranslations("comments");
  const [comments, setComments] = useState(initialComments);
  const [openComments, setOpenComments] = useState(true);
  const { data } = useSession();
  const user = data?.user;

  const handleAddComment = (newComment) => {
    setComments((prev) => [{ ...newComment, user }, ...prev]);
  };

  const handleDeleteComment = (commentId) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const handleEditing = (editedComment) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === editedComment.id
          ? { ...comment, ...editedComment }
          : comment,
      ),
    );
  };

  const CommentsComponents = () => (
    <div>
      {comments.map((comment) => (
        <CommentComponent
          handleDelete={handleDeleteComment}
          handleEdit={handleEditing}
          key={comment.id}
          comment={comment}
          user={comment.user}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      {user ? (
        <CommentForm product_id={productID} onAddComment={handleAddComment} />
      ) : (
        <Link href="/auth">
      <button
        type="button"
        className="
          w-full px-6 py-3 my-3
          bg-white text-gray-900
          border border-gray-300 rounded-lg
          shadow-sm
          hover:shadow-md hover:translate-y-0,5
          transition-all duration-200
          text-center font-extrabold 
        "
      >
        {t("loginRequired")}
      </button>
    </Link>
      )}

      <div className="flex flex-col gap-5">
        <div
          onClick={() => setOpenComments((s) => !s)}
          className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
        >
          <svg
            className="h-4 w-4 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M2.94 6.412A2 2 002 8.108V16a2 2 0 002 2h12a2 2 0 002-2V8.108a2 2 0 00-.94-1.696l-6-3.75a2 2 0 00-1.12 0l-6 3.75zm2.615 2.423a1 1 0 10-1.23 1.542l5.3 6.2a1 1 0 001.23 0l5.3-6.2a1 1 0 10-1.23-1.542L10 14.172l-4.445-5.337z"
              clipRule="evenodd"
            />
          </svg>
          <div>{comments.length} {t("count")}</div>
        </div>

        {comments && openComments && <CommentsComponents />}
      </div>
    </div>
  );
};

export default CommentSection;
