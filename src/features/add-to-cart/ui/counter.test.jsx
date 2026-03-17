import React, { createElement } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/entities/product", () => ({
  formatPriceFromCents: vi.fn((value) => `${value / 100}`),
  getLineItemTotalCents: vi.fn((priceCents, quantity) => priceCents * quantity),
}));

import Counter from "./counter";

describe("Counter", () => {
  it("calls the click handler for add and remove actions", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      createElement(Counter, {
        handleClick,
        state: { quantity: 2, loading: false },
      }),
    );

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]);
    await user.click(buttons[1]);

    expect(handleClick).toHaveBeenNthCalledWith(1, "remove");
    expect(handleClick).toHaveBeenNthCalledWith(2, "add");
  });

  it("disables quantity changes at min and max boundaries", () => {
    const { rerender } = render(
      createElement(Counter, {
        handleClick: vi.fn(),
        state: { quantity: 1, loading: false },
      }),
    );

    let buttons = screen.getAllByRole("button");
    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).not.toBeDisabled();

    rerender(
      createElement(Counter, {
        handleClick: vi.fn(),
        state: { quantity: 99, loading: false },
      }),
    );

    buttons = screen.getAllByRole("button");
    expect(buttons[0]).not.toBeDisabled();
    expect(buttons[1]).toBeDisabled();
  });

  it("shows the total price label and delete button when configured", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      createElement(Counter, {
        handleClick,
        state: {
          quantity: 3,
          loading: false,
          deleteButton: true,
          priceCents: 499,
          priceFractionDigits: 2,
        },
      }),
    );

    expect(screen.getByText("=14.97$")).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[2]);
    expect(handleClick).toHaveBeenCalledWith("remove");
  });
});
