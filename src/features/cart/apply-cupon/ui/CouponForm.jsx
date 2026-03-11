"use client";
import { Fetch } from "@/shared/lib";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { formatCurrencyValue } from "@/entities/product";
import { useTranslations } from "next-intl";

const CouponForm = ({ total, setAmount = () => {}, setCoupon = () => {} }) => {
  const t = useTranslations("coupon");
  const [submited, setSubmited] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  async function onSubmitingCuponForm() {
    let coupon = getValues("coupon");
    setSubmited(true);
    try {
      const data = await Fetch(`/api/cart/coupon?coupon=${coupon}`, "GET");
      if (data.status === 200) {
        setCoupon(data);
        let discount =
          data.type === "amount" ? data?.value : (total * data?.value) / 100;
        setAmount(discount);
        toast.success(
          `${t("applied")} ${formatCurrencyValue(discount, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}$`,
          {
            duration: 2000,
            icon: "🎉",
          },
        );
      } else {
        setError("coupon", { message: t("invalid") });
        setSubmited(false);
      }
    } catch (error) {
      console.error("Error while applying coupon:", error);
      setSubmited(false);
    }
  }

  return (
    <div>
      <label className="block text-unactive-text mt-5" htmlFor="cupon">
        {t("label")}
      </label>
      <form
        className={`flex border border-border rounded focus-visible:outline-none ${submited ? " bg-accent" : ""}`}
        onSubmit={handleSubmit(onSubmitingCuponForm)}
      >
        <input
          className="w-full inputStyle p-3 bg-input text-input-text"
          disabled={submited}
          placeholder={t("placeholder")}
          name="coupon"
          {...register("coupon", {
            minLength: { value: 5, message: "Minimum 5 letters" },
          })}
        />
        <button
          disabled={submited}
          className="p-2 bg-button text-button-text text-center font-extrabold font-mono rounded-r"
        >
          {t("button")}
        </button>
      </form>
      {errors.coupon && <p className="text-danger">{errors.coupon.message}</p>}
    </div>
  );
};

export default CouponForm;
