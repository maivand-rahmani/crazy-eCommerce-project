import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, vi } from "vitest";

vi.mock("@/entities/cart/ui/CartProductsList", () => ({
  __esModule: true,
  default: ({ setTotal, setItems }) => {
    React.useEffect(() => {
      setTotal(123);
      setItems([{ id: "item-1" }]);
    }, [setTotal, setItems]);

    return <div>cart list</div>;
  },
}));

vi.mock("@/entities/cart", () => ({
  OrderSummary: ({ total }) => <div data-testid="order-summary">total {total}</div>,
}));

import CartPage from "./page";

describe("Cart page", () => {
  it("renders cart list and order summary when total positive", async () => {
    render(<CartPage />);

    expect(await screen.findByText("cart list")).toBeInTheDocument();
    expect(await screen.findByTestId("order-summary")).toHaveTextContent("total 123");
  });
});
