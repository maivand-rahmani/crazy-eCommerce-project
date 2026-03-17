import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = {
  $transaction: vi.fn(),
};

const txStub = {
  orders: {
    findFirst: vi.fn(),
    create: vi.fn(),
  },
  carts: {
    findFirst: vi.fn(),
    update: vi.fn(),
  },
  product_variants: {
    updateMany: vi.fn(),
  },
  cart_items: {
    deleteMany: vi.fn(),
  },
  coupons: {
    update: vi.fn(),
  },
};

vi.mock("@prisma/client", () => ({
  Prisma: {
    TransactionIsolationLevel: {
      Serializable: "Serializable",
    },
  },
}));

vi.mock("../../../../prisma/client", () => ({
  __esModule: true,
  default: prismaMock,
}));

vi.mock("../../../../prisma/funcs", () => ({
  toSafeJson: (value) => value,
}));

vi.mock("@/entities/product", () => ({
  getProductPriceInfo: vi.fn(() => ({
    currentPriceCents: 2500,
    originalPriceCents: 2500,
    discountPercent: 0,
  })),
}));

describe("commerce checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMock.$transaction.mockImplementation((fn) => fn(txStub));
    txStub.orders.findFirst.mockResolvedValue(null);
    txStub.carts.findFirst.mockResolvedValue({
      id: 321,
      user_id: "user-1",
      status: "OPEN",
      cart_items: [
        {
          id: 1,
          quantity: 2,
          product_variants: {
            id: 50,
            stock_quantity: 5,
            product_images: [],
            variant_options: [],
            products: {
              id: 6,
              category_id: 4,
              name: "Keyboard",
              categories: null,
              product_images: [],
            },
          },
        },
      ],
    });
    txStub.product_variants.updateMany.mockResolvedValue({ count: 1 });
    txStub.orders.create.mockResolvedValue({ id: "order-1", total_cents: 5000, order_items: [] });
    txStub.cart_items.deleteMany.mockResolvedValue({ count: 1 });
    txStub.carts.update.mockResolvedValue({ id: 321, status: "CLOSED" });
    txStub.coupons.update.mockResolvedValue({ id: 1 });
  });

  it("closes the OPEN cart after a successful checkout", async () => {
    const { placeSandboxOrder } = await import("./index.js");

    const result = await placeSandboxOrder({
      userId: "user-1",
      address: {
        id: "addr-1",
        version: 1,
        street: "123 Demo Street",
        city: "Tehran",
        state: "Tehran",
        zip: "12345",
        country: "Iran",
        phone: "+989121234567",
      },
      orderRequestId: "req-123",
    });

    expect(prismaMock.$transaction).toHaveBeenCalledWith(expect.any(Function), {
      isolationLevel: "Serializable",
      maxWait: 5000,
      timeout: 10000,
    });
    expect(txStub.cart_items.deleteMany).toHaveBeenCalledWith({
      where: { cart_id: 321 },
    });
    expect(txStub.carts.update).toHaveBeenCalledWith({
      where: { id: 321 },
      data: { status: "CLOSED" },
    });
    expect(result).toEqual({
      order: { id: "order-1", total_cents: 5000, order_items: [] },
      summary: {
        subtotalCents: 5000,
        discountCents: 0,
        shippingCents: 0,
        taxCents: 0,
        totalCents: 5000,
      },
      created: true,
    });
  });
});
