"use client"
import Modal from '@/shared/ui/modal/Modal'
import React , { useState , useEffect } from 'react'
import AddUserAddressForm from '@/features/add-user-address/ui/addUserAddressModal'
import PaymentMockForm from '@/features/payment-mock/ui/PaymentMockForm'
import Fetch from '@/shared/lib/fetch'
import OrderingLoader from '@/entities/order/ui/ordering'
import { useRouter } from '@/shared/i18n/model/routing'
import { useTranslations } from "next-intl";

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
    <div className="w-full max-w-2xl mx-auto py-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-[2px] bg-border">
          <div
            className="h-full bg-text transition-all duration-500 ease-in-out"
            style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step) => {
          const isCompleted = activeStep > step.id;
          const isCurrent = activeStep === step.id;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center w-1/3">
              {/* Circle */}
              <div
                className={`
                  w-10 h-10 flex items-center justify-center rounded-full border-2
                  transition-all duration-500
                  ${isCompleted ? "bg-text border-text text-bg" : ""}
                  ${isCurrent ? "border-text text-text animate-pulse" : ""}
                  ${!isCompleted && !isCurrent ? "border-border text-unactive-text" : ""}
                `}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>

              {/* Label */}
              <span
                className={`
                  mt-3 text-sm font-medium transition-colors duration-300
                  ${isCurrent || isCompleted ? "text-text" : "text-unactive-text"}
                `}
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

const OrderModal = ({ isOpen , items , total , couponInfo , setOrderModal }) => {
    const [step , setStep] = useState(1)
    const router = useRouter()
    const [orderInfo , setOrderInfo] = useState({
        order_id: null,
        order_items: items.map((item) => ({ variant_id: item.variant_id, quantity: item.quantity , unit_price_cents: item.price_cents })),
        coupon_id: couponInfo.id,
        address: null ,
        status: "created",
        total_cents: items.reduce((total, item) => total + item.price_cents * item.quantity, 0),
        cart_id: items[0].cart_id
  })


  useEffect(() => {
    try {
      if (!orderInfo.order_id && step === 3) {
        (async () => {
          const data = await Fetch("/api/cart/order" , "POST" , null , orderInfo);
          if (data.status === 200) {
            setOrderInfo({ ...orderInfo, order_id: data.order.id });
            router.replace(`/orders/${data.order.id}`);
          }
        })();
    }    
    } catch (error) {
      return new Error(error)
    }
  }, [step])

  return (
    <Modal isOpen={isOpen} onClose={() => {setOrderModal(false)}}>
        <OrderStepper currentStep={step} />
        {step === 1 && <AddUserAddressForm setOrderInfo={setOrderInfo} setStep={setStep}/>}
        {step === 2 && <PaymentMockForm setOrderInfo={setOrderInfo} setStep={setStep} total={total} couponInfo={couponInfo} />}
        {step === 3 && <OrderingLoader success={orderInfo.order_id} />}
    </Modal>
  )
}

export default OrderModal