"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import { formatPriceFromCents } from "@/entities/product";

const PaymentMockForm = ({
  setStep,
  setOrderInfo,
  totalCents,
  couponInfo = null,
  summary = null,
}) => {
  const t = useTranslations("payment");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    defaultValues: {
      cardNumber: "4242 4242 4242 4242",
      expiryDate: "12/34",
      cvv: "123",
      cardholderName: "Sandbox Buyer",
    },
  });

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 16);
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(" ");
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const onSubmit = () => {
    setOrderInfo((state) => ({
      ...state,
      paymentMode: "mock",
      confirmedAt: new Date().toISOString(),
    }));
    setStep(3);
  };

  const orderSummary = summary || {
    subtotalCents: totalCents,
    discountCents: 0,
    shippingCents: 0,
    taxCents: 0,
    totalCents,
  };

  watch("cardNumber", "");
  watch("expiryDate", "");

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-md">
      <h2 className="mb-6 text-center text-2xl font-bold text-text">{t("title")}</h2>

      <div className="mb-6 rounded-md bg-bg p-4">
        <h3 className="mb-2 text-sm font-semibold text-text">{t("summary")}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-unactive-text">{t("subtotal")}:</span>
            <span className="font-medium text-text">
              ${formatPriceFromCents(orderSummary.subtotalCents, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          {orderSummary.discountCents > 0 ? (
            <div className="flex justify-between">
              <span className="text-unactive-text">{t("discount")}:</span>
              <span className="font-medium text-accent">
                -${formatPriceFromCents(orderSummary.discountCents, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          ) : null}
          <div className="flex justify-between">
            <span className="text-unactive-text">Shipping:</span>
            <span className="font-medium text-text">
              ${formatPriceFromCents(orderSummary.shippingCents, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-unactive-text">Tax:</span>
            <span className="font-medium text-text">
              ${formatPriceFromCents(orderSummary.taxCents, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between border-t border-border pt-2">
            <span className="font-semibold text-text">{t("total")}:</span>
            <span className="text-lg font-bold text-text">
              ${formatPriceFromCents(orderSummary.totalCents, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          {couponInfo?.code ? (
            <p className="pt-1 text-xs text-success">Coupon: {couponInfo.code}</p>
          ) : null}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="cardNumber" className="mb-1 block text-sm font-medium text-text">
            {t("cardNumber")}
          </label>
          <input
            id="cardNumber"
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder={t("placeholders.cardNumber")}
            className="w-full rounded-md border border-border bg-input px-3 py-2 text-input-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
          {errors.cardNumber ? (
            <p className="mt-1 text-sm text-danger">{errors.cardNumber.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="cardholderName" className="mb-1 block text-sm font-medium text-text">
            {t("cardholderName")}
          </label>
          <input
            id="cardholderName"
            type="text"
            autoComplete="cc-name"
            placeholder={t("placeholders.cardholderName")}
            className="w-full rounded-md border border-border bg-input px-3 py-2 text-input-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            {...register("cardholderName", {
              required: t("errors.cardholderRequired"),
              pattern: {
                value: /^[a-zA-Z\s]+$/,
                message: t("errors.cardholderPattern"),
              },
            })}
          />
          {errors.cardholderName ? (
            <p className="mt-1 text-sm text-danger">{errors.cardholderName.message}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiryDate" className="mb-1 block text-sm font-medium text-text">
              {t("expiryDate")}
            </label>
            <input
              id="expiryDate"
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder={t("placeholders.expiryDate")}
              maxLength="5"
              className="w-full rounded-md border border-border bg-input px-3 py-2 text-input-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
            {errors.expiryDate ? (
              <p className="mt-1 text-sm text-danger">{errors.expiryDate.message}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="cvv" className="mb-1 block text-sm font-medium text-text">
              {t("cvv")}
            </label>
            <input
              id="cvv"
              type="text"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder={t("placeholders.cvv")}
              maxLength="4"
              className="w-full rounded-md border border-border bg-input px-3 py-2 text-input-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              {...register("cvv", {
                required: t("errors.cvvRequired"),
                pattern: {
                  value: /^\d{3,4}$/,
                  message: t("errors.cvvPattern"),
                },
              })}
            />
            {errors.cvv ? <p className="mt-1 text-sm text-danger">{errors.cvv.message}</p> : null}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="my-2 w-full rounded-md bg-button px-4 py-2 font-medium text-button-text transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "..." : t("payNow")}
        </button>
      </form>

      <div className="mt-6 rounded-md bg-bg p-4">
        <h3 className="mb-2 text-sm font-semibold text-text">{t("testCards")}</h3>
        <div className="space-y-1 text-xs text-unactive-text">
          <p>- {t("visa")}: 4242 4242 4242 4242</p>
          <p>- {t("mastercard")}: 5555 5555 5555 4444</p>
          <p>- {t("anyExpiry")}</p>
          <p>- {t("anyCvv")}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMockForm;
