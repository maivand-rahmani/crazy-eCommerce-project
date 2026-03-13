import { describe, it, expect, beforeEach, vi } from "vitest";
import { Fetch } from "./fetch";

const cookiesStore = { get: vi.fn() };
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve(cookiesStore)),
}));

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

describe("Fetch helper", () => {
  const baseUrl = "https://api.test";

  beforeEach(() => {
    cookiesStore.get.mockReset();
    fetchMock.mockReset();
    process.env.NEXT_PUBLIC_API_URL = baseUrl;
    fetchMock.mockResolvedValue({
      json: () => Promise.resolve({ success: true }),
    });
  });

  it("sends Authorization header when session token exists", async () => {
    cookiesStore.get.mockReturnValueOnce({ value: "token-123" });

    await expect(Fetch("/data")).resolves.toEqual({ success: true });

    expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/data`, {
      method: "GET",
      headers: {
        Authorization: "Bearer token-123",
      },
      body: undefined,
    });
  });

  it("serializes body and sets Content-Type for POST", async () => {
    cookiesStore.get.mockReturnValueOnce(undefined);

    const payload = { foo: "bar" };
    await Fetch("/data", "POST", payload);

    expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  });
});
