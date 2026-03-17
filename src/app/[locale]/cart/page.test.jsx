import React from "react";
import { createElement } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { fetchMock } = vi.hoisted(() => ({
  fetchMock: vi.fn(),
}));

vi.mock("@/shared/lib", () => ({
  Fetch: fetchMock,
}));

vi.mock("@/entities/cart/ui/CartProductsList", () => ({
  __esModule: true,
  default: ({ cart, loading }) =>
    createElement(
      "div",
      null,
      loading ? "loading" : `cart list ${cart?.data?.length || 0}`,
    ),
}));

vi.mock("@/entities/cart", () => ({
  OrderSummary: ({ cart }) =>
    createElement(
      "div",
      { "data-testid": "order-summary" },
      `total ${cart?.summary?.totalCents || 0}`,
    ),
}));

import CartPage from "./page";

describe("Cart page", () => {
  it("renders cart list and order summary when total positive", async () => {
    fetchMock.mockResolvedValue({
      data: [{ id: "item-1", quantity: 1 }],
      summary: { itemsCount: 1, totalCents: 12300 },
      status: 200,
    });

    render(createElement(CartPage));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/cart");
    });

    expect(await screen.findByText("cart list 1")).toBeInTheDocument();
    expect(await screen.findByTestId("order-summary")).toHaveTextContent(
      "total 12300",
    );
  });
});
