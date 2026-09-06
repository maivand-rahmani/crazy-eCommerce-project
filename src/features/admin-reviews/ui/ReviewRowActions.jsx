"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const ReviewRowActions = ({ review, toggleAction, deleteAction }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const run = (action, payload, successMessage) => {
    startTransition(async () => {
      try {
        await action(payload);
        toast.success(successMessage);
        router.refresh();
      } catch (error) {
        toast.error(error.message || "Action failed.");
      }
    });
  };

  const handleToggle = () => {
    const formData = new FormData();
    formData.set("reviewId", String(review.id));
    formData.set("isHidden", review.isHidden ? "false" : "true");
    run(toggleAction, formData, review.isHidden ? "Review unhidden." : "Review hidden.");
  };

  const handleDelete = () => {
    if (!window.confirm("Delete this review permanently? Reactions and reports will be removed too.")) {
      return;
    }
    const formData = new FormData();
    formData.set("reviewId", String(review.id));
    run(deleteAction, formData, "Review deleted.");
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        title={review.isHidden ? "Unhide review" : "Hide review"}
        aria-label={review.isHidden ? "Unhide review" : "Hide review"}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/70 text-muted transition-all duration-200 hover:border-border hover:bg-card hover:text-text disabled:opacity-50"
      >
        {review.isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        title="Delete review"
        aria-label="Delete review"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-danger/30 bg-danger/10 text-danger transition-all duration-200 hover:bg-danger/20 disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ReviewRowActions;
