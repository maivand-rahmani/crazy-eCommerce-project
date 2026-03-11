import { beforeEach, describe, expect, it, vi } from "vitest";

const addToCartMock = vi.fn();
const toast = {
  error: vi.fn(),
  success: vi.fn(),
};

vi.mock("./addToCart.js", () => ({
  addToCart: addToCartMock,
}));

vi.mock("react-hot-toast", () => ({ toast }));

const createStateHarness = (initialCounter = 1) => {
  let counter = initialCounter;
  let added = null;
  const loadingStates = [];

  return {
    getCounter: () => counter,
    getAdded: () => added,
    getLoadingStates: () => loadingStates,
    setCounter: vi.fn((value) => {
      counter = typeof value === "function" ? value(counter) : value;
      return counter;
    }),
    setAdded: vi.fn((value) => {
      added = value;
      return value;
    }),
    setLoading: vi.fn((value) => {
      loadingStates.push(value);
      return value;
    }),
  };
};

describe("handleCartQuantityChange", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("optimistically adds an item and syncs with the server response", async () => {
    addToCartMock.mockResolvedValue({ item: { quantity: 3, id: 1 } });

    const harness = createStateHarness(2);
    const { handleCartQuantityChange } = await import(
      "./handleCartQuantityChangeOnClient.js"
    );

    await handleCartQuantityChange({
      setLoading: harness.setLoading,
      setCounter: harness.setCounter,
      setAdded: harness.setAdded,
      cart_id: 7,
      variantId: 10,
      method: "add",
    });

    expect(addToCartMock).toHaveBeenCalledWith(10, "add", 7);
    expect(harness.getCounter()).toBe(3);
    expect(harness.getAdded()).toEqual({ quantity: 3, id: 1 });
    expect(harness.getLoadingStates()).toEqual([true, false]);
  });

  it("rolls back the optimistic add when the request fails", async () => {
    addToCartMock.mockRejectedValue(new Error("network"));

    const harness = createStateHarness(2);
    const { handleCartQuantityChange } = await import(
      "./handleCartQuantityChangeOnClient.js"
    );

    await handleCartQuantityChange({
      setLoading: harness.setLoading,
      setCounter: harness.setCounter,
      setAdded: harness.setAdded,
      cart_id: 7,
      variantId: 10,
      method: "add",
    });

    expect(harness.getCounter()).toBe(2);
    expect(toast.error).toHaveBeenCalledWith(
      "Something gone wrong while sending request",
    );
    expect(harness.getLoadingStates()).toEqual([true, false]);
  });

  it("updates quantity on successful remove", async () => {
    addToCartMock.mockResolvedValue({ item: { quantity: 1, id: 1 } });

    const harness = createStateHarness(2);
    const { handleCartQuantityChange } = await import(
      "./handleCartQuantityChangeOnClient.js"
    );

    await handleCartQuantityChange({
      setLoading: harness.setLoading,
      setCounter: harness.setCounter,
      setAdded: harness.setAdded,
      cart_id: 7,
      variantId: 10,
      method: "remove",
    });

    expect(addToCartMock).toHaveBeenCalledWith(10, "remove", 7);
    expect(harness.getCounter()).toBe(1);
    expect(harness.getAdded()).toEqual({ quantity: 1, id: 1 });
  });

  it("clears local state and shows success feedback on delete", async () => {
    addToCartMock.mockResolvedValue({ success: true });

    const harness = createStateHarness(2);
    const { handleCartQuantityChange } = await import(
      "./handleCartQuantityChangeOnClient.js"
    );

    await handleCartQuantityChange({
      setLoading: harness.setLoading,
      setCounter: harness.setCounter,
      setAdded: harness.setAdded,
      cart_id: 7,
      variantId: 10,
      method: "delete",
    });

    expect(addToCartMock).toHaveBeenCalledWith(10, "delete", 7);
    expect(harness.getCounter()).toBe(0);
    expect(harness.getAdded()).toBe(false);
    expect(toast.success).toHaveBeenCalledWith("Item removed from cart");
    expect(harness.getLoadingStates()).toEqual([true, false]);
  });
});
