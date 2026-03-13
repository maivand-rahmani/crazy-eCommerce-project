import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ProductPrice from "./ProductPrice";

describe("ProductPrice", () => {
  it("renders original and discounted prices with formatting props", () => {
    render(
      <ProductPrice
        priceCents={1000}
        discountPercent={25}
        currencyPrefix="$"
        currencySuffix=" USD"
        formatPrice={(value) => `fmt-${value}`}
      />,
    );

    expect(screen.getByText("$fmt-1000 USD")).toBeInTheDocument();
    expect(screen.getByText("$fmt-750 USD")).toBeInTheDocument();
  });

  it("renders only the current price when there is no discount", () => {
    render(
      <ProductPrice
        priceCents={1000}
        formatPrice={(value) => `fmt-${value}`}
        showOriginalPrice={false}
      />,
    );

    expect(screen.getByText("fmt-1000")).toBeInTheDocument();
    expect(screen.queryAllByText("fmt-1000")).toHaveLength(1);
  });
});
