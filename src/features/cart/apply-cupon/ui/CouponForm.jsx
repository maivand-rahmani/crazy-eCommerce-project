"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { formatPriceFromCents } from "@/entities/product";
import { Fetch } from "@/shared/lib";

const CouponForm = ({ setCoupon = () => {} }) => {
  const t = useTranslations("coupon");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });
  const [appliedCode, setAppliedCode] = useState("");

  async function onSubmitCouponForm(values) {
    try {
      const coupon = values.coupon?.trim();
      const data = await Fetch(
        `/api/cart/coupon?coupon=${encodeURIComponent(coupon)}`,
        "GET",
      );

      if (data?.error || data?.status !== 200) {
        setError("coupon", { message: data?.error || t("invalid") });
        setCoupon(null);
        return;
      }

      setAppliedCode(coupon.toUpperCase());
      setCoupon(data);

      toast.success(
        `${t("applied")} ${formatPriceFromCents(data.summary.discountCents, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}$`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : t("invalid");
      setError("coupon", { message });
      setCoupon(null);
    }
  }

  return (
    <div>
      <label className="mt-5 block text-unactive-text" htmlFor="coupon">
        {t("label")}
      </label>
      <form
        className="mt-2 flex overflow-hidden rounded-xl border border-border"
        onSubmit={handleSubmit(onSubmitCouponForm)}
      >
        <input
          id="coupon"
          className="w-full bg-input p-3 text-input-text"
          disabled={isSubmitting}
          placeholder={t("placeholder")}
          autoComplete="off"
          spellCheck={false}
          {...register("coupon", {
            required: t("invalid"),
            minLength: { value: 3, message: t("invalid") },
            maxLength: { value: 32, message: t("invalid") },
          })}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-button px-4 text-center font-extrabold text-button-text transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "..." : t("button")}
        </button>
      </form>
      {appliedCode ? (
        <p className="mt-2 text-xs text-success">
          {t("activeCode")}: {appliedCode}
        </p>
      ) : null}
      {errors.coupon ? (
        <p className="mt-2 text-sm text-danger">{errors.coupon.message}</p>
      ) : null}
    </div>
  );
};

export default CouponForm;
