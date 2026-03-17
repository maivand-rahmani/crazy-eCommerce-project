import React, { createElement } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/entities/product", () => ({
  formatPriceFromCents: (value, options) =>
    new Intl.NumberFormat("en-US", options).format(Number(value ?? 0)),
}));

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
      cart: {
        summary: {
          subtotalCents: 15000,
          shippingCents: 0,
          taxCents: 0,
          totalCents: 15000,
        },
      },
      checkout: true,
      items: [],
    };

    render(createElement(OrderSummary, props));

    expect(screen.getByText("subtotal")).toBeInTheDocument();
    expect(screen.getByText("total")).toBeInTheDocument();
    expect(screen.getAllByText("15,000.00$").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("order")).toBeInTheDocument();
  });
});
