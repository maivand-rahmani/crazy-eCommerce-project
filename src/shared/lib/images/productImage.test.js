import { describe, expect, it, afterEach } from "vitest";
import { getProductImageUrl, PRODUCT_IMAGE_PLACEHOLDER } from "./productImage";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("getProductImageUrl", () => {
  it("builds a public URL from a plain filename/key", () => {
    expect(getProductImageUrl("unnamed.jpg")).toBe(
      "https://s3-nl.hostkey.com/b0ef80df8-dev/products/unnamed.jpg",
    );
  });

  it("returns absolute URLs unchanged", () => {
    expect(getProductImageUrl("https://cdn.example.com/a/b.jpg")).toBe(
      "https://cdn.example.com/a/b.jpg",
    );
    expect(getProductImageUrl("http://localhost:3000/uploads/x.png")).toBe(
      "http://localhost:3000/uploads/x.png",
    );
  });

  it("encodes spaces and Cyrillic per path segment", () => {
    expect(getProductImageUrl("my image.jpg")).toBe(
      "https://s3-nl.hostkey.com/b0ef80df8-dev/products/my%20image.jpg",
    );
    expect(getProductImageUrl("фото товара.jpg")).toBe(
      "https://s3-nl.hostkey.com/b0ef80df8-dev/products/%D1%84%D0%BE%D1%82%D0%BE%20%D1%82%D0%BE%D0%B2%D0%B0%D1%80%D0%B0.jpg",
    );
  });

  it("does not duplicate the products prefix", () => {
    expect(getProductImageUrl("products/foo/bar.jpg")).toBe(
      "https://s3-nl.hostkey.com/b0ef80df8-dev/products/foo/bar.jpg",
    );
  });

  it("preserves slashes between key segments", () => {
    expect(getProductImageUrl("dir/sub/имя.jpg")).toBe(
      "https://s3-nl.hostkey.com/b0ef80df8-dev/products/dir/sub/%D0%B8%D0%BC%D1%8F.jpg",
    );
  });

  it("returns the placeholder for empty values", () => {
    expect(getProductImageUrl("")).toBe(PRODUCT_IMAGE_PLACEHOLDER);
    expect(getProductImageUrl("   ")).toBe(PRODUCT_IMAGE_PLACEHOLDER);
    expect(getProductImageUrl(null)).toBe(PRODUCT_IMAGE_PLACEHOLDER);
    expect(getProductImageUrl(undefined)).toBe(PRODUCT_IMAGE_PLACEHOLDER);
  });

  it("honors env overrides", () => {
    process.env.NEXT_PUBLIC_S3_PUBLIC_URL = "https://cdn.example.com/root/";
    process.env.NEXT_PUBLIC_S3_PRODUCT_PREFIX = "catalog";
    expect(getProductImageUrl("unnamed.jpg")).toBe(
      "https://cdn.example.com/root/catalog/unnamed.jpg",
    );
  });
});
