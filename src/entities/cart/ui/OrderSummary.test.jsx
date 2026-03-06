import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { name: "Test user" } } }),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key) => key,
}));

vi.mock(
  "@/features/cart/apply-cupon/ui/CouponForm",
  () => ({ default: () => null }),
);

vi.mock(
  "@/entities/order/ui/modal/OrderModal",
  () => ({ default: () => null }),
);

import OrderSummary from "./OrderSummary";

describe("OrderSummary", () => {
  it("renders subtotal and total", () => {
    const props = {
      total: 150,
      setCheckout: vi.fn(),
      checkout: true,
      items: [],
    };

    render(<OrderSummary {...props} />);

    expect(screen.getByText("subtotal:")).toBeInTheDocument();
    expect(screen.getByText("total:")).toBeInTheDocument();
    expect(screen.getAllByText("150.00$").length).toBe(2);
    expect(screen.getByText("order")).toBeInTheDocument();
  });
});
