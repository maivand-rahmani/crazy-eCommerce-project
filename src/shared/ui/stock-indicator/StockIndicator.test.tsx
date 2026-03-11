import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getProductStockQuantityMock, getProductStockStateMock } = vi.hoisted(
  () => ({
    getProductStockQuantityMock: vi.fn(),
    getProductStockStateMock: vi.fn(),
  }),
);

vi.mock("@/entities/product", () => ({
  getProductStockQuantity: getProductStockQuantityMock,
  getProductStockState: getProductStockStateMock,
}));

import StockIndicator from "./StockIndicator";

describe("StockIndicator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the low stock label with the normalized quantity", () => {
    getProductStockQuantityMock.mockReturnValue(3);
    getProductStockStateMock.mockReturnValue("low-stock");

    render(<StockIndicator stockQuantity={3} onlyLeftLabel="Only left" />);

    expect(screen.getByLabelText("Only left 3")).toBeInTheDocument();
    expect(getProductStockStateMock).toHaveBeenCalledWith(3, 5);
  });

  it("shows the out of stock label only when enabled", () => {
    getProductStockQuantityMock.mockReturnValue(0);
    getProductStockStateMock.mockReturnValue("out-of-stock");

    const { rerender } = render(<StockIndicator stockQuantity={0} />);
    expect(screen.queryByText("Out of stock")).not.toBeInTheDocument();

    rerender(<StockIndicator stockQuantity={0} showOutOfStock />);
    expect(screen.getByLabelText("Out of stock")).toBeInTheDocument();
  });

  it("renders the in stock label when showInStock is true", () => {
    getProductStockQuantityMock.mockReturnValue(8);
    getProductStockStateMock.mockReturnValue("in-stock");

    render(<StockIndicator stockQuantity={8} showInStock inStockLabel="Available" />);

    expect(screen.getByLabelText("Available")).toBeInTheDocument();
  });
});
