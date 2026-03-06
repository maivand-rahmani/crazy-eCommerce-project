import { describe, it, expect, vi, beforeEach } from "vitest";

const fetchMock = vi.fn();
vi.mock("@/shared/lib/fetch", () => ({ Fetch: fetchMock }));

const hashMock = vi.fn();
vi.mock("bcrypt", () => ({ hash: hashMock }));

describe("register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("hashes the password and calls Fetch", async () => {
    hashMock.mockResolvedValue("hashed");
    fetchMock.mockResolvedValue({ id: "user" });

    const { register } = await import("./register.js");

    const payload = {
      firstname: "John",
      lastname: "Doe",
      email: "john@example.com",
      password: "1234",
    };

    const result = await register(payload);

    expect(hashMock).toHaveBeenCalledWith("1234", 10);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/register",
      "POST",
      null,
      {
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
        password: "hashed",
      },
    );
    expect(result).toEqual({ id: "user" });
  });
});
