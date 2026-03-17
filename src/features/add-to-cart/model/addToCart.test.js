import { describe, it, expect, beforeEach, vi } from "vitest";

const txStub = {
  carts: {
    findFirst: vi.fn(),
    create: vi.fn(),
  },
  cart_items: {
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};

const prismaMock = {
  carts: {
    findFirst: vi.fn(),
    create: vi.fn(),
  },
  product_variants: {
    findUnique: vi.fn(),
  },
  cart_items: {
    findUnique: vi.fn(),
    upsert: vi.fn(),
    delete: vi.fn(),
  },
  $transaction: vi.fn(),
};

const getServerSessionMock = vi.fn();

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

vi.mock("next-auth", () => ({
  getServerSession: getServerSessionMock,
}));

vi.mock("@/features/auth/model/authOptions", () => ({
  authOptions: {},
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("addToCart model", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    txStub.carts.findFirst.mockResolvedValue({ id: 456, user_id: "user-1", status: "OPEN" });
    txStub.carts.create.mockResolvedValue({ id: 456, user_id: "user-1", status: "OPEN" });
    prismaMock.product_variants.findUnique.mockResolvedValue({ stock_quantity: 10 });
    prismaMock.cart_items.findUnique.mockResolvedValue(null);
    getServerSessionMock.mockResolvedValue({ user: { id: "user-1" } });
    prismaMock.$transaction.mockImplementation((fn) => fn(txStub));
  });

  it("adds item via cart_items.upsert", async () => {
    prismaMock.cart_items.upsert.mockResolvedValueOnce({ id: 1 });

    const { addToCart } = await import("./addToCart.js");
    const result = await addToCart(123, "add", 456, "user-1");

    expect(result).toEqual({ item: { id: 1 } });
    expect(prismaMock.cart_items.upsert).toHaveBeenCalledWith({
      where: { cart_id_variant_id: { cart_id: 456, variant_id: 123 } },
      update: { quantity: { increment: 1 } },
      create: { cart_id: 456, variant_id: 123, quantity: 1 },
    });
  });

  it("removes quantity when more than one item exists", async () => {
    txStub.cart_items.findUnique.mockResolvedValueOnce({ quantity: 2 });
    txStub.cart_items.update.mockResolvedValueOnce({ quantity: 1 });

    const { addToCart } = await import("./addToCart.js");
    const result = await addToCart(123, "remove", 456, "user-1");

    expect(result).toEqual({ item: { quantity: 1 } });
    expect(txStub.cart_items.update).toHaveBeenCalled();
  });

  it("deletes row when quantity is one", async () => {
    txStub.cart_items.findUnique.mockResolvedValueOnce({ quantity: 1 });

    const { addToCart } = await import("./addToCart.js");
    const result = await addToCart(123, "remove", 456, "user-1");

    expect(result).toEqual({ item: null, removed: true });
  });

  it("deletes the row when method is delete", async () => {
    const { addToCart } = await import("./addToCart.js");
    const result = await addToCart(123, "delete", 456, "user-1");

    expect(result).toEqual({ success: true });
    expect(prismaMock.cart_items.delete).toHaveBeenCalled();
  });

  it("returns an error when the variant stock limit is reached", async () => {
    prismaMock.product_variants.findUnique.mockResolvedValueOnce({ stock_quantity: 2 });
    prismaMock.cart_items.findUnique.mockResolvedValueOnce({ quantity: 2 });

    const { addToCart } = await import("./addToCart.js");
    const result = await addToCart(123, "add", 456, "user-1");

    expect(result).toEqual({ error: "You already added the maximum available quantity." });
    expect(prismaMock.cart_items.upsert).not.toHaveBeenCalled();
  });

  it("creates a new OPEN cart when only CLOSED carts exist", async () => {
    txStub.carts.findFirst.mockResolvedValueOnce(null);
    txStub.carts.create.mockResolvedValueOnce({ id: 999, user_id: "user-1", status: "OPEN" });
    prismaMock.cart_items.upsert.mockResolvedValueOnce({ id: 7, cart_id: 999, variant_id: 123 });

    const { addToCart } = await import("./addToCart.js");
    const result = await addToCart(123, "add", 456, "user-1");

    expect(txStub.carts.create).toHaveBeenCalledWith({
      data: { user_id: "user-1", status: "OPEN" },
    });
    expect(prismaMock.cart_items.upsert).toHaveBeenCalledWith({
      where: { cart_id_variant_id: { cart_id: 999, variant_id: 123 } },
      update: { quantity: { increment: 1 } },
      create: { cart_id: 999, variant_id: 123, quantity: 1 },
    });
    expect(result).toEqual({ item: { id: 7, cart_id: 999, variant_id: 123 } });
  });

  it("re-reads the OPEN cart after a concurrent cart create P2002", async () => {
    txStub.carts.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 777, user_id: "user-1", status: "OPEN" });
    txStub.carts.create.mockRejectedValueOnce(Object.assign(new Error("Unique constraint failed"), {
      code: "P2002",
    }));
    prismaMock.cart_items.upsert.mockResolvedValueOnce({ id: 8, cart_id: 777, variant_id: 123 });

    const { addToCart } = await import("./addToCart.js");
    const result = await addToCart(123, "add", 456, "user-1");

    expect(txStub.carts.findFirst).toHaveBeenCalledTimes(2);
    expect(prismaMock.cart_items.upsert).toHaveBeenCalledWith({
      where: { cart_id_variant_id: { cart_id: 777, variant_id: 123 } },
      update: { quantity: { increment: 1 } },
      create: { cart_id: 777, variant_id: 123, quantity: 1 },
    });
    expect(result).toEqual({ item: { id: 8, cart_id: 777, variant_id: 123 } });
  });

  it("handles two parallel add-to-cart requests without surfacing P2002", async () => {
    txStub.carts.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 888, user_id: "user-1", status: "OPEN" });
    txStub.carts.create
      .mockResolvedValueOnce({ id: 888, user_id: "user-1", status: "OPEN" })
      .mockRejectedValueOnce(Object.assign(new Error("Unique constraint failed"), {
        code: "P2002",
      }));
    prismaMock.cart_items.upsert
      .mockResolvedValueOnce({ id: 9, cart_id: 888, variant_id: 123, quantity: 1 })
      .mockResolvedValueOnce({ id: 10, cart_id: 888, variant_id: 123, quantity: 2 });

    const { addToCart } = await import("./addToCart.js");
    const [firstResult, secondResult] = await Promise.all([
      addToCart(123, "add", 456, "user-1"),
      addToCart(123, "add", 456, "user-1"),
    ]);

    expect(txStub.carts.create).toHaveBeenCalledTimes(2);
    expect(txStub.carts.findFirst).toHaveBeenCalledTimes(3);
    expect(firstResult).toEqual({ item: { id: 9, cart_id: 888, variant_id: 123, quantity: 1 } });
    expect(secondResult).toEqual({ item: { id: 10, cart_id: 888, variant_id: 123, quantity: 2 } });
  });
});
