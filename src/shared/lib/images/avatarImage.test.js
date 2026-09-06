import { describe, expect, it, afterEach, beforeEach } from "vitest";
import { getAvatarImageUrl, AVATAR_IMAGE_PLACEHOLDER } from "./avatarImage";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  process.env.NEXT_PUBLIC_S3_PUBLIC_URL =
    "https://s3.ru1.storage.beget.cloud/5427be431039-dev";
  process.env.NEXT_PUBLIC_S3_AVATAR_PREFIX = "users/icons";
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("getAvatarImageUrl", () => {
  it("builds a public URL from a bare filename", () => {
    expect(getAvatarImageUrl("avatar.jpg")).toBe(
      "https://s3.ru1.storage.beget.cloud/5427be431039-dev/users/icons/avatar.jpg",
    );
  });

  it("does not duplicate the avatar prefix", () => {
    expect(getAvatarImageUrl("users/icons/u1/a.png")).toBe(
      "https://s3.ru1.storage.beget.cloud/5427be431039-dev/users/icons/u1/a.png",
    );
  });

  it("returns absolute URLs unchanged", () => {
    expect(getAvatarImageUrl("https://cdn.example.com/a.jpg")).toBe(
      "https://cdn.example.com/a.jpg",
    );
  });

  it("falls back to placeholder for empty/legacy values", () => {
    expect(getAvatarImageUrl("")).toBe(AVATAR_IMAGE_PLACEHOLDER);
    expect(getAvatarImageUrl("/uploads/x.png")).toBe(AVATAR_IMAGE_PLACEHOLDER);
  });
});
