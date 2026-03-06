import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi, beforeEach } from "vitest";
import PaymentMockForm from "./PaymentMockForm";

vi.mock("next-intl", () => ({
  useTranslations: () => (key) => key,
}));

describe("PaymentMockForm", () => {
  const setStep = vi.fn();
  const setOrderInfo = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders summary and submits payment", async () => {
    render(
      <PaymentMockForm
        setStep={setStep}
        setOrderInfo={setOrderInfo}
        total={120}
        couponInfo={{ type: "amount", value: 20 }}
      />,
    );

    expect(screen.getByText("subtotal:")).toBeInTheDocument();
    expect(screen.getByText("$120")).toBeInTheDocument();
    expect(screen.getByText("discount:")).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("cardholderName"), "Alice");
    await userEvent.type(screen.getByLabelText("expiryDate"), "12/34");
    await userEvent.click(screen.getByRole("button", { name: "payNow" }));

    expect(setStep).toHaveBeenCalledWith(3);
    expect(setOrderInfo).toHaveBeenCalledTimes(1);
    expect(typeof setOrderInfo.mock.calls[0][0]).toBe("function");
  });
});
