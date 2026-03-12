"use client";
import React, { useState } from "react";
import CouponForm from "../../../features/cart/apply-cupon/ui/CouponForm";
import { Link, X } from "lucide-react";
import OrderModal from "@/entities/order/ui/modal/OrderModal";
import { useSession } from "next-auth/react";
import { formatCurrencyValue } from "@/entities/product";
import { useTranslations } from "next-intl";

const OrderSummary = ({ total, setCheckout, checkout, items }) => {
  const t = useTranslations("orderSummary");
  const session = useSession();
  const user = session?.data?.user;

  const [coupon, setCoupon] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  const [orderModal, setOrderModal] = useState(false);
  const finalTotal = Math.max(0, (total || 0) - discountAmount);
  const formatAmount = (value) =>
    formatCurrencyValue(value, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Shipping cost calculation: Free shipping over $100, otherwise $10
  const subtotalAfterDiscount = (total || 0) - discountAmount;
  const shippingCost = subtotalAfterDiscount >= 100 ? 0 : 10;
  const isFreeShipping = shippingCost === 0;

  let discardCheckout = () => {
    setCheckout(false);
    setCoupon(false);
    setDiscountAmount(0);
  };

  let handleOrderSummary = () => {
    setOrderModal(true);
  };

  return (
    <div className="md:pt-25 p-4 transition-all duration-500 ease-in-out">
      <div className="rounded-2xl block sticky p-5 top-25 border-border border shadow-xl bg-surface">
        <div className="font-extrabold text-2xl uppercase flex justify-between">
          <h1>{t("title")}: </h1>
          {checkout && <X onClick={discardCheckout} />}
        </div>

        {
          <CouponForm
            total={total}
            setAmount={setDiscountAmount}
            setCoupon={setCoupon}
          />
        }

        {/* totals */}
        <div className="flex flex-col text-xl gap-5 my-5">
          <div className="font-bold flex justify-between">
            <h1>{t("subtotal")}: </h1>
            <h1>{formatAmount(total || 0)}$</h1>
          </div>
          {coupon && (
            <div className="flex justify-between text-unactive-text">
              <h1>{t("discount")}: </h1>
              <h1 className="text-success">-{formatAmount(discountAmount)}$</h1>
            </div>
          )}
          <div className="flex justify-between">
            <h1>{t("shipping") || "Shipping"}: </h1>
            <h1 className={isFreeShipping ? "text-success" : ""}>
              {isFreeShipping ? (t("free") || "Free") : `${formatAmount(shippingCost)}$`}
            </h1>
          </div>
          {isFreeShipping && (
            <div className="text-sm text-success">
              {t("freeShippingMessage") || "You qualify for free shipping!"}
            </div>
          )}
          <div className="font-bold flex justify-between">
            <h2>{t("total")}: </h2>
            <h2>{formatAmount(finalTotal + shippingCost)}$</h2>
          </div>
        </div>

        <button
          onClick={handleOrderSummary}
          className="bg-button text-button-text w-full p-5 text-center font-extrabold font-mono rounded"
        >
          {checkout ? t("order") : t("checkout")}
        </button>

        {orderModal && (
          <OrderModal
            items={items}
            isOpen={orderModal}
            setOrderModal={setOrderModal}
            total={total}
            couponInfo={coupon}
            user={user}
          />
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
