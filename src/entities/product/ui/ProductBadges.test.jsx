import React from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ProductBadges from "./ProductBadges";

describe("ProductBadges", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-11T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders sale and new badges for discounted recent products", () => {
    render(
      <ProductBadges
        createdAt="2026-03-09T08:00:00.000Z"
        discountPercent={20}
      />,
    );

    expect(screen.getByRole("list", { name: "Product badges" })).toBeInTheDocument();
    expect(screen.getByLabelText("Sale: 20% off")).toBeInTheDocument();
    expect(screen.getByLabelText("New product")).toBeInTheDocument();
  });

  it("supports custom labels", () => {
    render(
      <ProductBadges
        createdAt="2026-03-10T08:00:00.000Z"
        discountPercent={10}
        newLabel="Fresh"
        saleLabel="Deal"
      />,
    );

    expect(screen.getByText("Deal -10%")).toBeInTheDocument();
    expect(screen.getByText("Fresh")).toBeInTheDocument();
  });

  it("renders nothing when a product is neither new nor on sale", () => {
    const { container } = render(
      <ProductBadges
        createdAt="2026-02-20T08:00:00.000Z"
        discountPercent={0}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
