import { beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();

vi.mock("@/shared/lib", () => ({
  Fetch: fetchMock,
}));

describe("wishlist model", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requests the wishlist from the API", async () => {
    fetchMock.mockResolvedValue({ wishlist: [{ id: "item-1" }] });

    const { getWishlist } = await import("./index.js");

    await expect(getWishlist()).resolves.toEqual({ wishlist: [{ id: "item-1" }] });
    expect(fetchMock).toHaveBeenCalledWith("/api/wishlist");
  });
});
