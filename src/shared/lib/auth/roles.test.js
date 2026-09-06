import { describe, expect, it } from "vitest";

import { isAdmin, isSuperAdmin } from "./roles";

const baseUser = {
  role: "user",
  deletedAt: null,
  isBlocked: false,
};

describe("role helpers (unchanged behavior)", () => {
  it("isAdmin accepts admin and super_admin only", () => {
    expect(isAdmin({ ...baseUser, role: "admin" })).toBe(true);
    expect(isAdmin({ ...baseUser, role: "super_admin" })).toBe(true);
    expect(isAdmin(baseUser)).toBe(false);
    expect(isAdmin(null)).toBe(false);
  });

  it("isSuperAdmin accepts only super_admin", () => {
    expect(isSuperAdmin({ ...baseUser, role: "super_admin" })).toBe(true);
    expect(isSuperAdmin({ ...baseUser, role: "admin" })).toBe(false);
    expect(isSuperAdmin(baseUser)).toBe(false);
    expect(isSuperAdmin(null)).toBe(false);
  });

  it("blocked or deleted accounts lose both roles", () => {
    expect(isAdmin({ ...baseUser, role: "admin", isBlocked: true })).toBe(false);
    expect(isSuperAdmin({ ...baseUser, role: "super_admin", isBlocked: true })).toBe(false);
    expect(isAdmin({ ...baseUser, role: "admin", deletedAt: new Date() })).toBe(false);
    expect(isSuperAdmin({ ...baseUser, role: "super_admin", deletedAt: new Date() })).toBe(false);
  });
});
