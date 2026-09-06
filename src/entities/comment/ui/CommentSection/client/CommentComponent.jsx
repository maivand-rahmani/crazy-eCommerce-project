"use client";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { Flag, Star } from "lucide-react";
import { CommentReaction } from "@/entities/rating";
import { Edit01, Delete, DotsVertical } from "@untitledui/icons";
import { Dropdown } from "@/shared";
import { Fetch } from "@/shared/lib";
import { isAdmin } from "@/shared/lib/auth/roles";
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
  const [reported, setReported] = useState(Boolean(comment?.reportedByMe));
  const [reporting, setReporting] = useState(false);

  const isOwnReview = user?.id === currentUser?.id;

  const handleReport = async () => {
    if (reported || reporting || !currentUser || isOwnReview) return;

    setReporting(true);
    try {
      const reason = window.prompt(t("report.prompt"));
      if (reason === null) return;

      const data = await Fetch("/api/products/comments/report", "POST", {
        reviewId: comment.id,
        reason: reason.slice(0, 500),
      });

      if (data?.status === 201) {
        setReported(true);
        toast.success(t("report.success"));
      } else {
        toast.error(data?.error || t("report.error"));
      }
    } catch (error) {
      toast.error(t("report.error"));
    } finally {
      setReporting(false);
    }
  };

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
            {comment.isHidden && isAdmin(currentUser) ? (
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                {t("hiddenBadge")}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-1">
            {currentUser && !isOwnReview ? (
              <button
                type="button"
                onClick={handleReport}
                disabled={reporting}
                title={reported ? t("report.reportedTooltip") : t("report.tooltip")}
                aria-label={reported ? t("report.reported") : t("report.button")}
                aria-pressed={reported}
                className={`flex h-8 w-8 items-center justify-center rounded-full border border-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 ${
                  reported
                    ? "bg-danger/10 text-danger"
                    : "bg-card/70 text-muted hover:bg-card hover:text-text"
                }`}
              >
                <Flag className="h-3.5 w-3.5" fill={reported ? "currentColor" : "none"} />
              </button>
            ) : null}
            {isOwnReview && (
            <DropdownIcon
              setEditing={setEditing}
              comment={comment}
              editing={editing}
              handleDelete={deleteComment}
            />
            )}
          </div>
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
