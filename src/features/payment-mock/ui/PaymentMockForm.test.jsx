import React, { createElement } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next-intl", () => ({
  useTranslations: () => (key) => key,
}));

vi.mock("@/entities/product", () => ({
  formatPriceFromCents: (value, options) =>
    new Intl.NumberFormat("en-US", options).format(Number(value ?? 0)),
}));

import PaymentMockForm from "./PaymentMockForm";

describe("PaymentMockForm", () => {
  const setStep = vi.fn();
  const setOrderInfo = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders summary and submits payment", async () => {
    const user = userEvent.setup();

    render(
      createElement(PaymentMockForm, {
        setStep,
        setOrderInfo,
        totalCents: 12000,
        couponInfo: { code: "SAVE20" },
        summary: {
          subtotalCents: 12000,
          discountCents: 2000,
          shippingCents: 0,
          taxCents: 0,
          totalCents: 10000,
        },
      }),
    );

    expect(screen.getByText("subtotal:")).toBeInTheDocument();
    expect(screen.getByText("$12,000.00")).toBeInTheDocument();
    expect(screen.getByText("discount:")).toBeInTheDocument();
    expect(screen.getByText("-$2,000.00")).toBeInTheDocument();
    expect(screen.getByText("Coupon: SAVE20")).toBeInTheDocument();

    await user.clear(screen.getByLabelText("cardholderName"));
    await user.type(screen.getByLabelText("cardholderName"), "Alice");
    await user.click(screen.getByRole("button", { name: "payNow" }));

    expect(setStep).toHaveBeenCalledWith(3);
    expect(setOrderInfo).toHaveBeenCalledTimes(1);
    expect(typeof setOrderInfo.mock.calls[0][0]).toBe("function");
  });
});
