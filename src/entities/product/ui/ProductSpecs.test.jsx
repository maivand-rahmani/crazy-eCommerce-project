import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { fetchMock, getTranslationsMock } = vi.hoisted(() => ({
  fetchMock: vi.fn(),
  getTranslationsMock: vi.fn(),
}));

vi.mock("@/shared/lib", () => ({
  Fetch: fetchMock,
}));

vi.mock("next-intl/server", () => ({
  getTranslations: getTranslationsMock,
}));

import ProductSpecs from "./ProductSpecs";

describe("ProductSpecs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getTranslationsMock.mockResolvedValue((key) => key);
  });

  it("renders translated title and spec rows", async () => {
    fetchMock.mockResolvedValue({
      data: [
        { key: "RAM", value: "16 GB" },
        { key: "Storage", value: "512 GB" },
      ],
    });

    const view = await ProductSpecs({ productId: "product-7" });
    render(view);

    expect(fetchMock).toHaveBeenCalledWith("/api/products/specs?productId=product-7");
    expect(screen.getByText("details")).toBeInTheDocument();
    expect(screen.getByText("RAM:")).toBeInTheDocument();
    expect(screen.getByText("16 GB")).toBeInTheDocument();
    expect(screen.getByText("Storage:")).toBeInTheDocument();
    expect(screen.getByText("512 GB")).toBeInTheDocument();
  });

  it("returns null when there are no specs", async () => {
    fetchMock.mockResolvedValue(null);

    await expect(ProductSpecs({ productId: "product-7" })).resolves.toBeNull();
  });
});
