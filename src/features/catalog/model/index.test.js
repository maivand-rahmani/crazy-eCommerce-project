import { describe, it, expect, beforeEach, vi } from "vitest";

const fetchMock = vi.fn();
vi.mock("@/shared/lib", () => ({ Fetch: fetchMock }));

describe("catalog model", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({ data: [] });
  });

  it("requests category products with query string", async () => {
    await import("./index.js").then(({ getProducts }) => getProducts("electronics"));

    expect(fetchMock).toHaveBeenCalledWith("/api/products?category=electronics");
  });

  it("requests single product by variant id", async () => {
    await import("./index.js").then(({ getProduct }) => getProduct("variant-5"));

    expect(fetchMock).toHaveBeenCalledWith("/api/products/variant-5");
  });

  it("fetches categories", async () => {
    await import("./index.js").then(({ getCategories }) => getCategories());

    expect(fetchMock).toHaveBeenCalledWith("/api/categories");
  });

  it("searches with encoded query and limit", async () => {
    await import("./index.js").then(({ searchProducts }) =>
      searchProducts("smart watches"),
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/products/search?search=smart%20watches&limit=20",
    );
  });
});
