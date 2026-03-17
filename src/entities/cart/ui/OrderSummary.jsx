"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import CouponForm from "@/features/cart/apply-cupon/ui/CouponForm";
import OrderModal from "@/entities/order/ui/modal/OrderModal";
import { formatPriceFromCents } from "@/entities/product";

const OrderSummary = ({ cart, checkout, items, onOrderCreated = null }) => {
  const t = useTranslations("orderSummary");
  const [couponPreview, setCouponPreview] = useState(null);
  const [orderModal, setOrderModal] = useState(false);

  const summary = useMemo(() => {
    const baseSummary = cart?.summary || {
      subtotalCents: 0,
      shippingCents: 0,
      taxCents: 0,
      totalCents: 0,
    };

    if (!couponPreview?.summary) {
      return {
        ...baseSummary,
        discountCents: 0,
      };
    }

    return {
      ...baseSummary,
      ...couponPreview.summary,
    };
  }, [cart, couponPreview]);

  const totalItems = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  return (
    <aside className="p-4 md:pt-16">
      <div className="sticky top-24 rounded-[28px] border border-border/70 bg-surface p-5 shadow-[0_22px_60px_-36px_rgba(15,23,42,0.35)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold uppercase text-text">{t("title")}</h2>
            <p className="mt-1 text-sm text-unactive-text">{totalItems} items in this sandbox order</p>
          </div>
        </div>

        <CouponForm setCoupon={setCouponPreview} />

        <div className="mt-6 space-y-3 text-sm text-text">
          <div className="flex items-center justify-between">
            <span>{t("subtotal")}</span>
            <span>{formatPriceFromCents(summary.subtotalCents, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}$</span>
          </div>
          {summary.discountCents > 0 ? (
            <div className="flex items-center justify-between text-success">
              <span>{t("discount")}</span>
              <span>-{formatPriceFromCents(summary.discountCents, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}$</span>
            </div>
          ) : null}
          <div className="flex items-center justify-between text-unactive-text">
            <span>Shipping</span>
            <span>{formatPriceFromCents(summary.shippingCents, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}$</span>
          </div>
          <div className="flex items-center justify-between text-unactive-text">
            <span>Tax</span>
            <span>{formatPriceFromCents(summary.taxCents, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}$</span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3 text-base font-bold">
            <span>{t("total")}</span>
            <span>{formatPriceFromCents(summary.totalCents, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}$</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOrderModal(true)}
          disabled={summary.totalCents <= 0}
          className="mt-6 w-full rounded-2xl bg-button px-4 py-4 text-center font-extrabold text-button-text transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {checkout ? t("order") : t("checkout")}
        </button>

        <p className="mt-3 text-xs leading-5 text-unactive-text">
          Sandbox checkout is fully server-controlled. Totals, coupon validation, stock, and final order status are recalculated on submit.
        </p>

        {orderModal ? (
          <OrderModal
            items={items}
            isOpen={orderModal}
            setOrderModal={setOrderModal}
            cart={cart}
            couponInfo={couponPreview?.coupon || null}
            onOrderCreated={onOrderCreated}
          />
        ) : null}
      </div>
    </aside>
  );
};

export default OrderSummary;
