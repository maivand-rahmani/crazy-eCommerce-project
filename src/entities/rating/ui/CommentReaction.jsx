"use client";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { ThumbsDown, ThumbsUp } from "lucide-react";

export function CommentReaction({ commentId, likes, dislikes, userReaction }) {
  const [liked, setLiked] = useState(userReaction === "like");
  const [disLiked, setDisLiked] = useState(userReaction === "dislike");

  const [likesCount, setLikesCount] = useState(likes);
  const [dislikesCount, setDislikesCount] = useState(dislikes);

  const [, startTransition] = useTransition();

  async function sendReaction(type) {
    const prev = {
      liked,
      disLiked,
      likesCount,
      dislikesCount,
    };

    
    if (type === "like") {
      const willLike = !liked;

      setLiked(willLike);
      if (willLike) {
        setDisLiked(false);
      }

      setLikesCount((c) => c + (willLike ? 1 : -1));
      if (disLiked) setDislikesCount((c) => c - 1);
    } else {
      const willDis = !disLiked;

      setDisLiked(willDis);
      if (willDis) {
        setLiked(false);
      }

      setDislikesCount((c) => c + (willDis ? 1 : -1));
      if (liked) setLikesCount((c) => c - 1);
    }

    
    startTransition(async () => {
      const res = await fetch("/api/products/comments/reaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, type }),
      });

      if (!res.ok) {
        setLiked(prev.liked);
        setDisLiked(prev.disLiked);
        setLikesCount(prev.likesCount);
        setDislikesCount(prev.dislikesCount);

        toast.error("Не удалось сохранить реакцию");
        return;
      }

      
      const data = await res.json();
      setLikesCount(data.likes);
      setDislikesCount(data.dislikes);
    });
  }

  return (
    <div className="flex gap-4 p-4">
      <div className="flex gap-2 center">
        <ThumbsUp
          className="transition cursor-pointer"
          onClick={() => sendReaction("like")}
          fill={liked ? "#2b7fff" : "transparent"}
        />
        {likesCount}
      </div>

      <div className="flex gap-2 center">
        <ThumbsDown
          className="transition cursor-pointer"
          onClick={() => sendReaction("dislike")}
          fill={disLiked ? "red" : "transparent"}
        />
        {dislikesCount}
      </div>
    </div>
  );
}
