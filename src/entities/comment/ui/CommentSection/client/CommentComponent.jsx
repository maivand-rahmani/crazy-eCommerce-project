"use client";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { CommentReaction } from "@/entities/rating";
import { Edit01, Delete, DotsVertical } from "@untitledui/icons";
import { Dropdown } from "@/shared";
import { Fetch } from "@/shared/lib";
import Rating from "@/entities/rating";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";

const DropdownIcon = ({ setEditing, editing, comment, handleDelete }) => {
  const t = useTranslations("comments");
  return (
    <Dropdown.Root>
      <Dropdown.DotsButton>
        <DotsVertical />
      </Dropdown.DotsButton>
      <Dropdown.Popover className={"bg-white"}>
        <Dropdown.Menu>
          <Dropdown.Section>
            <Dropdown.Item
              icon={Edit01}
              onClick={() => {
                setEditing(!editing);
              }}
            >
              {t("edit")}
            </Dropdown.Item>
            <Dropdown.Item
              icon={Delete}
              onClick={() => handleDelete(comment.id)}
            >
              {t("delete")}
            </Dropdown.Item>
          </Dropdown.Section>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.Root>
  );
};

const CommentComponent = ({ comment, user, handleDelete, handleEdit }) => {
  const t = useTranslations("comments");
  const [commentText, editCommentText] = useState(comment?.comment);

  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(comment?.rating); //

  const { data: session } = useSession();
  const currentUser = session?.user;

  const deleteComment = async (commentId) => {
    const data = await Fetch(`/api/products/comments`, "DELETE" , {
      id: commentId,
    });
    if (data?.status === 201) {
      handleDelete(commentId);
      toast.success(t("success.deleted"));
      return true;
    } else {
      return false;
    }
  };

  const editComment = async (commentId) => {
    const data = await Fetch(`/api/products/comments`, "PUT" , {
      id: commentId,
      comment: commentText,
      rating: rating,
    });
    if (data?.status === 201) {
      handleEdit(data.comment);
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await editComment(comment.id);
    if (res) {
      toast.success(t("success.edited"));
      setEditing((i) => !i);
    } else {
      toast.error(t("errors.somethingWrong"));
    }
  };

  return (
    <div className="w-full h-full shadow-xl grid grid-cols-[40px_1fr]   border-b-unactive-text rounded-3xl p-4">
      <img
        className="rounded-full"
        width={40}
        height={40}
        src={user?.image ? user.image : "/icons/profile-circle-svgrepo-com.svg"}
        alt="image"
      />
      <div>
        <div className="flex w-full h-10 pl-4 justify-between items-center">
          <div className="flex gap-2 h-full center">
            <h1>{user?.name}</h1>
            <span className="text-unactive-text">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          {user?.id === currentUser?.id && (
            <DropdownIcon
              setEditing={setEditing}
              comment={comment}
              editing={editing}
              handleDelete={deleteComment}
            />
          )}
        </div>
        <form className="pl-4" onSubmit={handleSubmit}>
          <div className="w-full gap-5 grid grid-cols-[50px_1fr_100px]">
            <span className="p-1 self-start rounded center flex bg-primary text-primary-text">
              {rating}
              <Star width={15} height={15} />
            </span>
            <textarea
              disabled={!editing}
              autoFocus={editing}
              value={commentText}
              className="resize-none h-full w-full"
              aria-label="comment for product"
              onChange={(e) => editCommentText(e.target.value)}
            ></textarea>

            {editing && (
              <button
                className="p-2 self-start bg-primary rounded text-primary-text"
                aria-label="edited comment submitting"
              >
                {t("submit")}
              </button>
            )}
          </div>
          {editing && (
            <div>
              <Rating onChange={setRating} value={rating} />
            </div>
          )}
        </form>
        <CommentReaction
          commentId={comment.id}
          dislikes={comment.dislikes}
          userReaction={comment.userReaction}
          likes={comment.likes}
        />
      </div>
    </div>
  );
};

export default CommentComponent;
