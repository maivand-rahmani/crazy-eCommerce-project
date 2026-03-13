import { describe, it, expect, beforeEach, vi } from "vitest";

const txStub = {
  cart_items: {
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};

const prismaMock = {
  cart_items: {
    upsert: vi.fn(),
    delete: vi.fn(),
  },
  $transaction: vi.fn(),
};

vi.mock("../../../../prisma/client", () => ({
  __esModule: true,
  default: prismaMock,
}));

vi.mock("../../../../prisma/funcs", () => ({
  toSafeJson: (value) => value,
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("addToCart model", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMock.$transaction.mockImplementation((fn) => fn(txStub));
  });

  it("adds item via cart_items.upsert", async () => {
    prismaMock.cart_items.upsert.mockResolvedValueOnce({ id: 1 });

    const { addToCart } = await import("./addToCart.js");
    const result = await addToCart(123, "add", 456);

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
    const result = await addToCart(123, "remove", 456);

    expect(result).toEqual({ item: { quantity: 1 } });
    expect(txStub.cart_items.update).toHaveBeenCalled();
  });

  it("deletes row when quantity is one", async () => {
    txStub.cart_items.findUnique.mockResolvedValueOnce({ quantity: 1 });

    const { addToCart } = await import("./addToCart.js");
    const result = await addToCart(123, "remove", 456);

    expect(result).toEqual({ item: null });
  });

  it("deletes the row when method is delete", async () => {
    const { addToCart } = await import("./addToCart.js");
    const result = await addToCart(123, "delete", 456);

    expect(result).toEqual({ success: true });
    expect(prismaMock.cart_items.delete).toHaveBeenCalled();
  });
});
