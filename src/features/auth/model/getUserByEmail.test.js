import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = {
  user: {
    findUnique: vi.fn(),
  },
};

vi.mock("../../../../prisma/client", () => ({
  __esModule: true,
  default: prismaMock,
}));

describe("getUserByEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the matching user", async () => {
    const user = { id: "user-1", email: "john@example.com" };
    prismaMock.user.findUnique.mockResolvedValue(user);

    const { getUserByEmail } = await import("./getUserByEmail.js");

    await expect(getUserByEmail("john@example.com")).resolves.toEqual(user);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: "john@example.com" },
    });
  });

  it("returns null when the user is missing", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const { getUserByEmail } = await import("./getUserByEmail.js");

    await expect(getUserByEmail("missing@example.com")).resolves.toBeNull();
  });

  it("returns an Error object when the query throws", async () => {
    prismaMock.user.findUnique.mockRejectedValue(new Error("db failed"));

    const { getUserByEmail } = await import("./getUserByEmail.js");
    const result = await getUserByEmail("john@example.com");

    expect(result).toBeInstanceOf(Error);
  });
});
