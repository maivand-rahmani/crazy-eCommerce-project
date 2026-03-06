import { describe, expect, it } from "vitest";
import { cx } from "./cx";

describe("cx utility", () => {
  it("dedups repeated classes", () => {
    const result = cx("flex", "flex", "flex", "text-lg");
    expect(result).toBe("flex text-lg");
  });

  it("ignores falsy inputs from arrays and objects", () => {
    const result = cx("bg-primary", ["text-white", "", undefined], false && "text-red-500");
    expect(result).toBe("bg-primary text-white");
  });
});
