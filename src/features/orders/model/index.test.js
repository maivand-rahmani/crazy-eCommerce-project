import { beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();

vi.mock("@/shared/lib", () => ({
  Fetch: fetchMock,
}));

describe("orders model", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the orders data collection", async () => {
    fetchMock.mockResolvedValue({ data: [{ id: "order-1" }] });

    const { getOrders } = await import("./index.js");

    await expect(getOrders()).resolves.toEqual([{ id: "order-1" }]);
    expect(fetchMock).toHaveBeenCalledWith("/api/orders");
  });

  it("returns a single order by id", async () => {
    fetchMock.mockResolvedValue({ data: { id: "order-9" } });

    const { getOrder } = await import("./index.js");

    await expect(getOrder("order-9")).resolves.toEqual({ id: "order-9" });
    expect(fetchMock).toHaveBeenCalledWith("/api/orders/order-9");
  });

  it("throws when the API returns an error", async () => {
    fetchMock.mockResolvedValue({ error: "Order not found" });

    const { getOrder } = await import("./index.js");

    await expect(getOrder("missing-order")).rejects.toThrow("Order not found");
  });
});
