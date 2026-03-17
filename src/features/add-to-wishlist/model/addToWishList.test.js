import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = {
  wishlist: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
  wishlist_items: {
    findFirst: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
};

const revalidatePathMock = vi.fn();
const getServerSessionMock = vi.fn();

vi.mock("../../../../prisma/client", () => ({
  __esModule: true,
  default: prismaMock,
}));

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}));

vi.mock("next-auth", () => ({
  getServerSession: getServerSessionMock,
}));

vi.mock("@/app/api/auth/[...nextauth]/route", () => ({
  authParams: { providers: [] },
}));

describe("addToWishlist", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns an unauthorized response when there is no authenticated user", async () => {
    getServerSessionMock.mockResolvedValue(null);

    const { default: addToWishlist } = await import("./addToWishList.js");

    await expect(addToWishlist(1, 2, 3)).resolves.toEqual({
      status: "error",
      message: "Unauthorized",
    });
    expect(prismaMock.wishlist.findUnique).not.toHaveBeenCalled();
  });

  it("creates a wishlist if needed and adds the item", async () => {
    getServerSessionMock.mockResolvedValue({ user: { id: "user-1" } });
    prismaMock.wishlist.findUnique.mockResolvedValue(null);
    prismaMock.wishlist.create.mockResolvedValue({ id: "wishlist-1" });
    prismaMock.wishlist_items.findFirst.mockResolvedValue(null);
    prismaMock.wishlist_items.create.mockResolvedValue({ id: "line-1" });

    const { default: addToWishlist } = await import("./addToWishList.js");
    const result = await addToWishlist(10, 20);

    expect(prismaMock.wishlist.create).toHaveBeenCalledWith({
      data: { user_id: "user-1" },
    });
    expect(prismaMock.wishlist_items.create).toHaveBeenCalledWith({
      data: {
        wishlist_id: "wishlist-1",
        product_id: 10,
        variant_id: 20,
      },
    });
    expect(revalidatePathMock).toHaveBeenCalledTimes(3);
    expect(result).toEqual({ status: "added" });
  });

  it("removes an existing wishlist item when it is already present", async () => {
    const existing = { id: "line-1", variant_id: 20 };

    getServerSessionMock.mockResolvedValue({ user: { id: "user-1" } });
    prismaMock.wishlist.findUnique.mockResolvedValue({ id: "wishlist-1" });
    prismaMock.wishlist_items.findFirst.mockResolvedValue(existing);
    prismaMock.wishlist_items.delete.mockResolvedValue(existing);

    const { default: addToWishlist } = await import("./addToWishList.js");
    const result = await addToWishlist(10, 20);

    expect(prismaMock.wishlist_items.delete).toHaveBeenCalledWith({
      where: { id: "line-1" },
    });
    expect(revalidatePathMock).toHaveBeenCalledTimes(3);
    expect(result).toEqual({ status: "removed", line: existing });
  });
});
