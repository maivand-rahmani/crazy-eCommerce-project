import { describe, it, expect, vi, beforeEach } from "vitest";

const fetchMock = vi.fn();
vi.mock("@/shared/lib/fetch", () => ({ Fetch: fetchMock }));

describe("register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("validates payload and calls Fetch", async () => {
    fetchMock.mockResolvedValue({ id: "user" });

    const { register } = await import("./register.js");

    const payload = {
      firstname: "John",
      lastname: "Doe",
      email: "john@example.com",
      password: "12345678",
    };

    const result = await register(payload);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/register",
      "POST",
      {
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
        password: "12345678",
      },
    );
    expect(result).toEqual({ id: "user" });
  });

  it("normalizes the email before sending it to the API", async () => {
    fetchMock.mockResolvedValue({ id: "user" });

    const { register } = await import("./register.js");

    await register({
      firstname: "John",
      lastname: "Doe",
      email: " John@Example.com ",
      password: "12345678",
    });

    expect(fetchMock).toHaveBeenLastCalledWith(
      "/api/auth/register",
      "POST",
      expect.objectContaining({ email: "john@example.com" }),
    );
  });
});
