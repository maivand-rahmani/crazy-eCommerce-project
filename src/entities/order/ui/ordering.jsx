"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CreditCard, Package, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const OrderingLoader = ({ success }) => {
  const t = useTranslations("orderModal");
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [finished, setFinished] = useState(false);

  const steps = [
    { icon: CreditCard, label: t("processing") },
    { icon: Package, label: t("preparing") },
    { icon: Truck, label: t("readyToShip") },
  ];

  // Step progression
  useEffect(() => {
    if (!success) return;

    const timers = [
      setTimeout(() => setCurrentStep(1), 600),
      setTimeout(() => setCurrentStep(2), 1200),
      setTimeout(() => {
        setCurrentStep(3);
        setFinished(true);
      }, 1800),
      setTimeout(() => router.push("/"), 2800),
    ];

    return () => timers.forEach(clearTimeout);
  }, [success, router]);

  return (
    <div className="flex items-center justify-center z-50">
      <div className="bg-surface rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-border">
        {/* MAIN ICON */}
        <div className="flex justify-center mb-8">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {!finished ? (
                <motion.div
                  key="loader"
                  className="w-20 h-20 border-4 border-muted rounded-full absolute"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <motion.div
                  key="success"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-accent rounded-full flex items-center justify-center"
                >
                  <Check className="w-10 h-10 text-button-text" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* TITLE */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-text mb-2">
            {finished ? `${t("success")} 🎉` : t("creating")}
          </h2>
          <p className="text-unactive-text text-sm">
            {finished
              ? t("redirecting")
              : t("pleaseWait")}
          </p>
        </div>

        {/* STEPS */}
        <div className="space-y-5">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isDone = currentStep > index;
            const isActive = currentStep === index;

            return (
              <motion.div
                key={index}
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2
                  ${isDone ? "bg-accent border-accent" : ""}
                  ${isActive ? "border-primary" : ""}
                  ${!isDone && !isActive ? "border-border" : ""}
                  `}
                  animate={
                    isActive
                      ? { scale: [1, 1.1, 1] }
                      : {}
                  }
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {isDone ? (
                    <Check className="w-5 h-5 text-button-text" />
                  ) : (
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? "text-primary" : "text-unactive-text"
                      }`}
                    />
                  )}
                </motion.div>

                <p
                  className={`text-sm font-medium ${
                    isDone
                      ? "text-accent"
                      : isActive
                      ? "text-text"
                      : "text-unactive-text"
                  }`}
                >
                  {step.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderingLoader;
