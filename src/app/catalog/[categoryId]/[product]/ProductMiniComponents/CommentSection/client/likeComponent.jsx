"use client";
import React , { useState } from 'react';
import { ThumbsDown, ThumbsUp} from "lucide-react";
export function LikeDisLike({ comment }) {
  const [liked, setLiked] = useState(false);
  const [disLiked, setdisLiked] = useState(false);


  return (
    <div className="flex gap-4 p-4">
      <div className="flex gap-2">
        <ThumbsUp
        className=' transition'
          onClick={() => setLiked((l) => !l && !disLiked)}
          fill={`${liked ? "#2b7fff" : "transparent"}`}
        />
        {comment.likes}
      </div>
      <div className="flex gap-2">
        <ThumbsDown
        className=' transition'
          onClick={() => setdisLiked((l) => !l && !liked) && !liked}
          fill={`${disLiked ? "blue" : "transparent"}`}
        />
        {comment.dislikes}
      </div>
    </div>
  );
}
