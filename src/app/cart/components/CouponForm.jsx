"use client";
import Fetch from "@/funcs/fetch";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const CouponForm = ({
  total,
  setAmount = () => {},
  setCoupon = () => {},
}) => {
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
          data.type === "amount"
            ? data?.value
            : ((total / 100) * data?.value).toFixed(2);
        setAmount(discount);
        toast.success(`Promo code applied you save ${discount}`, {
          duration: 2000,
          icon: "🎉",
        });
      } else {
        setError("coupon", { message: "the coupon is invalid!" });
        setSubmited(false);
      }
    } catch (error) {
      console.log("error while applying coupon", error);
      setSubmited(false);
    }
  }

  return (
    <div>
      <label className="block text-unactive-text mt-5" htmlFor="cupon">
        Discount code / Promo code
      </label>
      <form
        className={`flex border rounded focus-visible:outline-none ${submited ? " bg-green-700" : ""}`}
        onSubmit={handleSubmit(onSubmitingCuponForm)}
      >
        <input
          className="w-full p-3"
          disabled={submited}
          placeholder="Code"
          name="coupon"
          {...register("coupon", {
            minLength: { value: 5, message: "Minimum 5 letters" },
          })}
        />
        <button
          disabled={submited}
          className="p-2 bg-black text-white text-center font-extrabold font-mono rounded-r"
        >
          check
        </button>
      </form>
      {errors.coupon && <p className="text-red-500">{errors.coupon.message}</p>}
    </div>
  );
};

export default CouponForm;
