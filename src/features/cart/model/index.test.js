import { describe, it, expect, beforeEach, vi } from "vitest";

const fetchMock = vi.fn();
vi.mock("@/shared/lib", () => ({ Fetch: fetchMock }));

describe("cart model", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({ data: [], summary: { totalCents: 0 } });
  });

  it("requests cart data via Fetch", async () => {
    const { getUserCart } = await import("./index.js");
    const result = await getUserCart();

    expect(result).toEqual({ data: [], summary: { totalCents: 0 } });
    expect(fetchMock).toHaveBeenCalledWith("/api/cart");
  });
});
