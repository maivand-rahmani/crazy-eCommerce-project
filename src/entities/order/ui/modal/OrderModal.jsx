"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import Modal from "@/shared/ui/modal/Modal";
import AddUserAddressForm from "@/features/add-user-address/ui/addUserAddressModal";
import PaymentMockForm from "@/features/payment-mock/ui/PaymentMockForm";
import OrderingLoader from "@/entities/order/ui/ordering";
import { Fetch } from "@/shared/lib/fetch";
import { useRouter } from "@/shared/i18n/model/routing";

function buildCheckoutRequestId() {
  return crypto.randomUUID();
}

export function OrderStepper({ currentStep = 1 }) {
  const t = useTranslations("orderModal");
  const [activeStep, setActiveStep] = useState(currentStep);

  const steps = [
    { id: 1, label: t("steps.addresses") },
    { id: 2, label: t("steps.paying") },
    { id: 3, label: t("steps.confirming") },
  ];

  useEffect(() => {
    setActiveStep(currentStep);
  }, [currentStep]);

  return (
    <div className="mx-auto w-full max-w-2xl py-8">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 top-5 h-0.5 w-full bg-border">
          <div
            className="h-full bg-text transition-all duration-500 ease-in-out"
            style={{
              width: `${((activeStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {steps.map((step) => {
          const isCompleted = activeStep > step.id;
          const isCurrent = activeStep === step.id;

          return (
            <div key={step.id} className="relative z-10 flex w-1/3 flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                  isCompleted ? "border-text bg-text text-bg" : ""
                } ${isCurrent ? "animate-pulse border-text text-text" : ""} ${
                  !isCompleted && !isCurrent ? "border-border text-unactive-text" : ""
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  step.id
                )}
              </div>

              <span
                className={`mt-3 text-sm font-medium transition-colors duration-300 ${
                  isCurrent || isCompleted ? "text-text" : "text-unactive-text"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const OrderModal = ({ isOpen, items, cart, couponInfo, setOrderModal, onOrderCreated }) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderInfo, setOrderInfo] = useState({
    checkoutRequestId: buildCheckoutRequestId(),
    address: null,
  });
  const requestStateRef = useRef({ requestId: null, status: "idle" });

  const orderSummary = useMemo(() => cart?.summary || null, [cart]);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setError("");
      setSubmitting(false);
      setOrderCompleted(false);
      requestStateRef.current = { requestId: null, status: "idle" };
      setOrderInfo({
        checkoutRequestId: buildCheckoutRequestId(),
        address: null,
      });
    }
  }, [isOpen]);

  const handleOrderSuccess = useCallback(
    async (data) => {
      setOrderCompleted(true);

      if (typeof onOrderCreated === "function") {
        await onOrderCreated(data);
      }

      setOrderModal(false);
      router.replace(`/orders/${data.order.id}`);
      router.refresh();
    },
    [onOrderCreated, router, setOrderModal],
  );

  useEffect(() => {
    if (step !== 3 || !isOpen || orderCompleted) {
      return;
    }

    if (!orderInfo.address) {
      setStep(1);
      return;
    }

    const requestId = orderInfo.checkoutRequestId;
    if (
      requestStateRef.current.requestId === requestId &&
      ["started", "completed"].includes(requestStateRef.current.status)
    ) {
      return;
    }

    requestStateRef.current = { requestId, status: "started" };

    const submitOrder = async () => {
      setSubmitting(true);
      setError("");

      try {
        const data = await Fetch("/api/cart/order", "POST", {
          address: orderInfo.address,
          couponCode: couponInfo?.code || null,
          orderRequestId: requestId,
        });

        if (requestStateRef.current.requestId !== requestId) {
          return;
        }

        if (data?.error || data?.status !== 200) {
          throw new Error(data?.error || "Checkout failed.");
        }

        requestStateRef.current = { requestId, status: "completed" };
        await handleOrderSuccess(data);
      } catch (requestError) {
        if (requestStateRef.current.requestId !== requestId) {
          return;
        }

        requestStateRef.current = { requestId, status: "idle" };

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Checkout failed.",
        );
        setStep(2);
      } finally {
        if (requestStateRef.current.requestId === requestId) {
          setSubmitting(false);
        }
      }
    };

    submitOrder();
  }, [
    couponInfo,
    handleOrderSuccess,
    isOpen,
    orderCompleted,
    orderInfo.address,
    orderInfo.checkoutRequestId,
    step,
  ]);

  return (
    <Modal
      isOpen={isOpen}
      disableClose={submitting}
      onClose={() => {
        if (submitting) {
          return;
        }

        setOrderModal(false);
      }}
    >
      <OrderStepper currentStep={step} />
      {error ? (
        <p className="mx-auto mb-4 max-w-xl rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      ) : null}

      {step === 1 ? (
        <AddUserAddressForm setOrderInfo={setOrderInfo} setStep={setStep} />
      ) : null}

      {step === 2 ? (
        <PaymentMockForm
          setOrderInfo={setOrderInfo}
          setStep={setStep}
          totalCents={orderSummary?.totalCents || 0}
          couponInfo={couponInfo}
          summary={orderSummary}
        />
      ) : null}

      {step === 3 ? <OrderingLoader success={orderCompleted} /> : null}
    </Modal>
  );
};

export default OrderModal;
