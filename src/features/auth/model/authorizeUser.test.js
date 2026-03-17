import { beforeEach, describe, expect, it, vi } from "vitest";

const getUserByEmailMock = vi.fn();
const compareMock = vi.fn();

vi.mock("./getUserByEmail", () => ({
  getUserByEmail: getUserByEmailMock,
}));

vi.mock("bcrypt", () => ({
  compare: compareMock,
}));

describe("authorizeUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws when credentials are missing", async () => {
    const { authorizeUser } = await import("./authorizeUser.js");

    await expect(authorizeUser({ email: "", password: "" })).rejects.toThrow(
      "Enter a valid email address.",
    );
  });

  it("throws when the password is shorter than 8 characters", async () => {
    const { authorizeUser } = await import("./authorizeUser.js");

    await expect(
      authorizeUser({ email: "john@example.com", password: "1234" }),
    ).rejects.toThrow("Password must be at least 8 characters long.");
  });

  it("throws when the user cannot be found", async () => {
    getUserByEmailMock.mockResolvedValue(null);

    const { authorizeUser } = await import("./authorizeUser.js");

    await expect(
      authorizeUser({ email: "john@example.com", password: "secret12" }),
    ).rejects.toThrow("Invalid email or password.");
  });

  it("throws when the password does not match", async () => {
    getUserByEmailMock.mockResolvedValue({
      id: "user-1",
      password: "hashed-password",
    });
    compareMock.mockResolvedValue(false);

    const { authorizeUser } = await import("./authorizeUser.js");

    await expect(
      authorizeUser({ email: "john@example.com", password: "secret12" }),
    ).rejects.toThrow("Invalid email or password.");
  });

  it("returns the user when credentials are valid", async () => {
    const user = {
      id: "user-1",
      email: "john@example.com",
      name: "John Doe",
      password: "hashed-password",
    };
    getUserByEmailMock.mockResolvedValue(user);
    compareMock.mockResolvedValue(true);

    const { authorizeUser } = await import("./authorizeUser.js");

    await expect(
      authorizeUser({ email: "john@example.com", password: "secret12" }),
    ).resolves.toEqual({
      id: "user-1",
      email: "john@example.com",
      name: "John Doe",
      image: null,
      role: "user",
      isBlocked: false,
      deletedAt: null,
      createdAt: null,
      updatedAt: null,
    });
    expect(compareMock).toHaveBeenCalledWith("secret12", "hashed-password");
  });
});
