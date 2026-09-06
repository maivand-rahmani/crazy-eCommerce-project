import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = {
  appSetting: {
    findMany: vi.fn(),
  },
};

vi.mock("../../../../prisma/client", () => ({
  __esModule: true,
  default: prismaMock,
}));

vi.mock("@/features/admin-common", () => ({
  ensureSuperAdminAction: vi.fn(),
}));

vi.mock("@/shared/lib/admin/revalidate", () => ({
  revalidateLocalizedPaths: vi.fn(),
  revalidateLocalizedPath: vi.fn(),
}));

describe("getSettings (unchanged behavior)", () => {
  beforeEach(() => {
    vi.resetModules();
    prismaMock.appSetting.findMany.mockReset();
  });

  it("merges stored rows over defaults", async () => {
    prismaMock.appSetting.findMany.mockResolvedValue([
      { key: "store.name", value: "Custom Store" },
    ]);

    const { getSettings, DEFAULT_SETTINGS } = await import("./settings");
    const settings = await getSettings();

    expect(settings["store.name"]).toBe("Custom Store");
    // Untouched keys keep their defaults.
    expect(settings["store.tagline"]).toBe(DEFAULT_SETTINGS["store.tagline"]);
    expect(settings["admin.pageSize"]).toBe(DEFAULT_SETTINGS["admin.pageSize"]);
  });

  it("returns defaults when nothing is stored", async () => {
    prismaMock.appSetting.findMany.mockResolvedValue([]);

    const { getSettings, DEFAULT_SETTINGS } = await import("./settings");
    const settings = await getSettings();

    expect(settings["contact.email"]).toBe(DEFAULT_SETTINGS["contact.email"]);
  });

  it("getSetting falls back to defaults for unknown keys", async () => {
    prismaMock.appSetting.findMany.mockResolvedValue([]);

    const { getSetting, DEFAULT_SETTINGS } = await import("./settings");

    await expect(getSetting("store.name")).resolves.toBe(
      DEFAULT_SETTINGS["store.name"],
    );
    await expect(getSetting("nope.unknown.key")).resolves.toBeNull();
  });
});
