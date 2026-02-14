"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

const PaymentMockForm = ({ setStep, setOrderInfo , total , couponInfo = { discountAmount: 0 , coupon_id: null }}) => {
  const t = useTranslations("payment");
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ defaultValues: { cardNumber: "4242 4242 4242 4242", expiryDate: "1212" , cvv: "123" } });

  const cardNumber = watch("cardNumber", "");
  const expiryDate = watch("expiryDate", "");

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(" ");
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const onSubmit = (data) => {
    setOrderInfo((s) => ({ ...s, status: "paid" }));
    setStep(3);
  };

  const finalTotal = couponInfo ? couponInfo.type === "amount" ? total - couponInfo.value : total - (total * (couponInfo.value / 100)) : total
  const discountAmount = total - finalTotal;

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">{t("title")}</h2>
      
      {/* Compact Order Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">{t("summary")}</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">{t("subtotal")}:</span>
            <span className="font-medium">${(total)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">{t("discount")}:</span>
              <span className="font-medium text-green-600">-${(discountAmount.toFixed(2))}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="font-semibold">{t("total")}:</span>
            <span className="font-bold text-lg">${(finalTotal)}</span>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Card Number */}
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
            {t("cardNumber")}
          </label>
          <input
            id="cardNumber"
            type="text"
            placeholder={t("placeholders.cardNumber")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            {...register("cardNumber", {
              required: t("errors.cardNumberRequired"),
              pattern: {
                value: /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/,
                message: t("errors.cardNumberPattern"),
              },
              onChange: (e) => {
                e.target.value = formatCardNumber(e.target.value);
              },
            })}
          />
          {errors.cardNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
          )}
        </div>

        {/* Cardholder Name */}
        <div>
          <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">
            {t("cardholderName")}
          </label>
          <input
            id="cardholderName"
            type="text"
            placeholder={t("placeholders.cardholderName")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            {...register("cardholderName", {
              required: t("errors.cardholderRequired"),
              pattern: {
                value: /^[a-zA-Z\s]+$/,
                message: t("errors.cardholderPattern"),
              },
            })}
          />
          {errors.cardholderName && (
            <p className="mt-1 text-sm text-red-600">{errors.cardholderName.message}</p>
          )}
        </div>

        {/* Expiry Date and CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
              {t("expiryDate")}
            </label>
            <input
              id="expiryDate"
              type="text"
              placeholder={t("placeholders.expiryDate")}
              maxLength="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register("expiryDate", {
                required: t("errors.expiryRequired"),
                pattern: {
                  value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                  message: t("errors.expiryPattern"),
                },
                onChange: (e) => {
                  e.target.value = formatExpiryDate(e.target.value);
                },
              })}
            />
            {errors.expiryDate && (
              <p className="mt-1 text-sm text-red-600">{errors.expiryDate.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
              {t("cvv")}
            </label>
            <input
              id="cvv"
              type="text"
              placeholder={t("placeholders.cvv")}
              maxLength="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register("cvv", {
                required: t("errors.cvvRequired"),
                pattern: {
                  value: /^\d{3,4}$/,
                  message: t("errors.cvvPattern"),
                },
              })}
            />
            {errors.cvv && (
              <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 my-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
        >
          {t("payNow")}
        </button>
      </form>

      {/* Test Cards Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">{t("testCards")}</h3>
        <div className="text-xs text-gray-600 space-y-1">
          <p>• {t("visa")}: 4242 4242 4242 4242</p>
          <p>• {t("mastercard")}: 5555 5555 5555 4444</p>
          <p>• {t("anyExpiry")}</p>
          <p>• {t("anyCvv")}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMockForm;