"use client";
import React, { useState } from "react";
import { CommentAction } from "../model/FormAction";
import styled from "styled-components";
import Rating from "@/entities/rating";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";

export const CommentForm = ({ product_id, onAddComment }) => {
  const t = useTranslations("comments");
  const [rating, setRating] = useState(0); // здесь хранится выбранная звезда
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) return toast.error(t("errors.rating"));
    if (!comment) return toast.error(t("errors.comment"));

    const formData = new FormData(e.target);
    formData.set("rating", rating);

    const res = await CommentAction(formData);

    if (res?.newComment) {
      onAddComment(res.newComment);
      toast.success(t("success.added"));
      setComment(""); // очистка
      setRating(0);
    } else {
      toast.error(t("errors.somethingWrong"));
    }
  };

  return (
    <div>
      <form
        className="rounded-3xl shadow-lg p-4 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center gap-3">
          <h1>{t("rateProduct")}</h1>
          <Rating value={rating} onChange={setRating} />
        </div>

        <textarea
          onChange={(e) => setComment(e.target.value)}
          placeholder={t("placeholder")}
          value={comment}
          className="p-3 w-full min-h-[100px] rounded border border-border focus:outline-none"
          required
        />

        {/* <input type="hidden" name="user_id" value={userId} /> */}
        <input type="hidden" name="comment" value={comment} />
        <input type="hidden" name="rating" value={rating} />
        <input type="hidden" name="productId" value={product_id} />

        <button
          className="bg-primary text-primary-text px-10 py-2 w-full btn rounded-3xl shadow-xl"
          type="submit"
        >
          {t("submit")}
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
