import { describe, expect, it, vi } from "vitest";

vi.mock("next-intl/server", () => ({
  getRequestConfig: (factory: unknown) => factory,
}));

import requestConfig from "./request";

describe("i18n request config", () => {
  it("returns messages for a supported locale", async () => {
    const result = await requestConfig({
      requestLocale: Promise.resolve("ru"),
    });

    expect(result.locale).toBe("ru");
    expect(result.messages?.header.logo).toBe("кибер");
  });

  it("falls back to english for unsupported locales", async () => {
    const result = await requestConfig({
      requestLocale: Promise.resolve("de"),
    });

    expect(result.locale).toBe("en");
    expect(result.messages?.header.logo).toBe("cyber");
  });

  it("falls back to english when locale is missing", async () => {
    const result = await requestConfig({
      requestLocale: Promise.resolve(undefined),
    });

    expect(result.locale).toBe("en");
    expect(result.messages?.header.logo).toBe("cyber");
  });
});
