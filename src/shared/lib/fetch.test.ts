import { describe, it, expect, beforeEach, vi } from "vitest";
import { Fetch } from "./fetch";

const cookiesStore = { get: vi.fn(), toString: vi.fn() };
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve(cookiesStore)),
}));

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

describe("Fetch helper", () => {
  const baseUrl = "https://app.test";

  beforeEach(() => {
    cookiesStore.get.mockReset();
    cookiesStore.toString.mockReset();
    fetchMock.mockReset();
    process.env.NEXTAUTH_URL = baseUrl;
    process.env.INTERNAL_APP_URL = "";
    process.env.NEXT_PUBLIC_APP_URL = "";
    cookiesStore.toString.mockReturnValue("");
    fetchMock.mockResolvedValue({
      headers: {
        get: vi.fn(() => "application/json"),
      },
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
    });
  });

  it("forwards cookies when request cookies exist", async () => {
    cookiesStore.toString.mockReturnValueOnce("next-auth.session-token=token-123");

    await expect(Fetch("/data")).resolves.toEqual({ success: true, status: 200 });

    expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/data`, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        Cookie: "next-auth.session-token=token-123",
      },
      body: undefined,
    });
  });

  it("serializes body and sets Content-Type for POST", async () => {
    const payload = { foo: "bar" };
    await Fetch("/data", "POST", payload);

    expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/data`, {
      method: "POST",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  });

  it("returns raw arrays without adding a status envelope", async () => {
    fetchMock.mockResolvedValueOnce({
      headers: {
        get: vi.fn(() => "application/json"),
      },
      ok: true,
      status: 200,
      json: () => Promise.resolve([{ id: 1 }]),
    });

    await expect(Fetch("/data")).resolves.toEqual([{ id: 1 }]);
  });
});
