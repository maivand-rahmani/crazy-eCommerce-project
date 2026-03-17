import { beforeEach, describe, expect, it, vi } from "vitest";

const getAuthUserFromRequest = vi.fn();
const normalizeAddressInput = vi.fn();
const placeSandboxOrder = vi.fn();

vi.mock("@/shared/lib/auth", () => ({
  getAuthUserFromRequest,
}));

vi.mock("@/shared/lib", () => ({
  normalizeAddressInput,
}));

vi.mock("@/shared/lib/commerce", () => ({
  placeSandboxOrder,
}));

function createRequest(body) {
  return new Request("http://localhost/api/cart/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/cart/order", () => {
  beforeEach(() => {
    vi.resetModules();
    getAuthUserFromRequest.mockReset();
    normalizeAddressInput.mockReset();
    placeSandboxOrder.mockReset();
  });

  it("rejects anonymous checkout", async () => {
    getAuthUserFromRequest.mockResolvedValue(null);

    const { POST } = await import("./route");
    const response = await POST(createRequest({}));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
    expect(normalizeAddressInput).not.toHaveBeenCalled();
    expect(placeSandboxOrder).not.toHaveBeenCalled();
  });

  it("rejects blocked users before checkout processing", async () => {
    getAuthUserFromRequest.mockResolvedValue({
      id: "user-1",
      isBlocked: true,
      deletedAt: null,
    });

    const { POST } = await import("./route");
    const response = await POST(createRequest({}));

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      error: "Your account cannot place orders.",
    });
    expect(normalizeAddressInput).not.toHaveBeenCalled();
    expect(placeSandboxOrder).not.toHaveBeenCalled();
  });

  it("places an order using normalized address and server-side summary", async () => {
    getAuthUserFromRequest.mockResolvedValue({
      id: "user-1",
      isBlocked: false,
      deletedAt: null,
    });
    normalizeAddressInput.mockReturnValue({
      id: "addr-1",
      street: "123 Demo Street",
      city: "Tehran",
      state: "Tehran",
      zip: "12345",
      country: "Iran",
      phone: "+989121234567",
      isDefault: false,
      version: 1,
    });
    placeSandboxOrder.mockResolvedValue({
      created: true,
      order: { id: "order-1" },
      summary: { subtotalCents: 1500, discountCents: 0, totalCents: 1500 },
    });

    const { POST } = await import("./route");
    const payload = {
      address: { street: " 123 Demo Street " },
      couponCode: "save10",
      orderRequestId: "req-123",
      total_cents: 1,
      order_items: [{ variant_id: 9, quantity: 99 }],
    };
    const response = await POST(createRequest(payload));

    expect(normalizeAddressInput).toHaveBeenCalledWith(payload.address);
    expect(placeSandboxOrder).toHaveBeenCalledWith({
      userId: "user-1",
      address: normalizeAddressInput.mock.results[0].value,
      couponCode: "save10",
      orderRequestId: "req-123",
    });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      message: "Order created",
      order: { id: "order-1" },
      summary: { subtotalCents: 1500, discountCents: 0, totalCents: 1500 },
      created: true,
      status: 200,
    });
  });

  it("returns validation errors for invalid addresses", async () => {
    getAuthUserFromRequest.mockResolvedValue({
      id: "user-1",
      isBlocked: false,
      deletedAt: null,
    });
    normalizeAddressInput.mockImplementation(() => {
      throw new Error("Street address is required.");
    });

    const { POST } = await import("./route");
    const response = await POST(createRequest({ address: {} }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Street address is required.",
    });
    expect(placeSandboxOrder).not.toHaveBeenCalled();
  });

  it("returns conflicts for stock or cart state issues", async () => {
    getAuthUserFromRequest.mockResolvedValue({
      id: "user-1",
      isBlocked: false,
      deletedAt: null,
    });
    normalizeAddressInput.mockReturnValue({ id: "addr-1" });
    placeSandboxOrder.mockRejectedValue(new Error("One or more items are out of stock."));

    const { POST } = await import("./route");
    const response = await POST(
      createRequest({
        address: { street: "123 Demo Street" },
        orderRequestId: "req-123",
      }),
    );

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      error: "One or more items are out of stock.",
    });
  });

  it("returns a JSON parse error for malformed bodies", async () => {
    getAuthUserFromRequest.mockResolvedValue({
      id: "user-1",
      isBlocked: false,
      deletedAt: null,
    });

    const { POST } = await import("./route");
    const response = await POST({
      json: vi.fn().mockRejectedValue(new SyntaxError("Unexpected end of JSON input")),
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Request body must be valid JSON.",
    });
  });
});
