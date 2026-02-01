"use client";
import React, { useState } from "react";
import { CommentAction } from "../model/FormAction";
import styled from "styled-components";
import Rating from "@/entities/rating/ui/Rating";
import { toast } from "react-hot-toast";

export const CommentForm = ({ product_id, onAddComment }) => {
  const [rating, setRating] = useState(0); // здесь хранится выбранная звезда
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) return toast.error("Please add a rating");
    if (!comment) return toast.error("Please add a comment");

    const formData = new FormData(e.target);
    formData.set("rating", rating);

    const res = await CommentAction(formData);

    if (res?.newComment) {
      onAddComment(res.newComment);
      toast.success("comment successfully added");
      setComment(""); // очистка
      setRating(0);
    } else {
      toast.error("Something gone wrong");
    }
  };

  return (
    <div>
      <form
        className="rounded-3xl shadow-xl p-4 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center gap-3">
          <h1>Rate the product:</h1>
          <Rating value={rating} onChange={setRating} />
        </div>

        <textarea
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          value={comment}
          className="p-3 w-full min-h-[100px] rounded border border-gray-300 focus:outline-none"
          required
        />

        {/* <input type="hidden" name="user_id" value={userId} /> */}
        <input type="hidden" name="comment" value={comment} />
        <input type="hidden" name="rating" value={rating} />
        <input type="hidden" name="productId" value={product_id} />

        <button
          className="bg-blue-500 text-white px-10 py-2 w-full btn rounded-3xl shadow-xl"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
