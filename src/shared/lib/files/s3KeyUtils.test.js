import { describe, expect, it, afterEach, beforeEach } from "vitest";
import {
  buildS3Key,
  extractS3Key,
  getImageExtension,
  getProductPrefix,
  normalizeEndpoint,
  sanitizeSegment,
} from "./s3KeyUtils";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  process.env.NEXT_PUBLIC_S3_PRODUCT_PREFIX = "products";
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("normalizeEndpoint", () => {
  it("strips trailing slashes", () => {
    expect(normalizeEndpoint("https://s3.ru1.storage.beget.cloud/")).toBe(
      "https://s3.ru1.storage.beget.cloud",
    );
    expect(normalizeEndpoint("https://s3.ru1.storage.beget.cloud///")).toBe(
      "https://s3.ru1.storage.beget.cloud",
    );
  });

  it("keeps endpoints without trailing slashes", () => {
    expect(normalizeEndpoint("https://s3.ru1.storage.beget.cloud")).toBe(
      "https://s3.ru1.storage.beget.cloud",
    );
  });
});

describe("getProductPrefix", () => {
  it("reads the configured prefix", () => {
    process.env.NEXT_PUBLIC_S3_PRODUCT_PREFIX = "catalog";
    expect(getProductPrefix()).toBe("catalog");
  });

  it("defaults to products", () => {
    delete process.env.NEXT_PUBLIC_S3_PRODUCT_PREFIX;
    expect(getProductPrefix()).toBe("products");
  });

  it("normalizes leading/trailing slashes", () => {
    process.env.NEXT_PUBLIC_S3_PRODUCT_PREFIX = "/catalog/";
    expect(getProductPrefix()).toBe("catalog");
  });
});

describe("getImageExtension", () => {
  it("maps supported MIME types to extensions", () => {
    expect(getImageExtension("image/jpeg")).toBe(".jpg");
    expect(getImageExtension("image/jpg")).toBe(".jpg");
    expect(getImageExtension("image/png")).toBe(".png");
    expect(getImageExtension("image/webp")).toBe(".webp");
  });

  it("returns null for unsupported MIME types", () => {
    expect(getImageExtension("image/gif")).toBeNull();
    expect(getImageExtension("application/pdf")).toBeNull();
    expect(getImageExtension("")).toBeNull();
  });
});

describe("sanitizeSegment", () => {
  it("keeps safe characters and replaces the rest", () => {
    expect(sanitizeSegment("123")).toBe("123");
    expect(sanitizeSegment("a b/c")).toBe("a-b-c");
    expect(sanitizeSegment("фото")).toBe("----");
  });
});

describe("buildS3Key", () => {
  it("builds a key from prefix, segments and file name", () => {
    expect(
      buildS3Key({ prefix: "products", segments: ["42"], fileName: "uuid.jpg" }),
    ).toBe("products/42/uuid.jpg");
  });

  it("supports nested segments", () => {
    expect(
      buildS3Key({
        prefix: "products",
        segments: ["42", "variants", "7"],
        fileName: "uuid.png",
      }),
    ).toBe("products/42/variants/7/uuid.png");
  });

  it("sanitizes segments and skips empty ones", () => {
    expect(
      buildS3Key({ prefix: "products", segments: ["a b", "", null], fileName: "x.webp" }),
    ).toBe("products/a-b/x.webp");
  });
});

describe("extractS3Key", () => {
  const params = {
    publicUrl: "https://s3.ru1.storage.beget.cloud/5427be431039-dev",
    prefix: "products",
  };

  it("extracts a plain key under the prefix", () => {
    expect(extractS3Key("products/42/uuid.jpg", params)).toBe("products/42/uuid.jpg");
  });

  it("extracts a key from a matching public URL", () => {
    expect(
      extractS3Key("https://s3.ru1.storage.beget.cloud/5427be431039-dev/products/42/uuid.jpg", params),
    ).toBe("products/42/uuid.jpg");
  });

  it("returns null for legacy local upload paths", () => {
    expect(extractS3Key("/uploads/admin/foo.jpg", params)).toBeNull();
    expect(extractS3Key("/uploads/products/foo.png", params)).toBeNull();
  });

  it("returns null for foreign absolute URLs", () => {
    expect(extractS3Key("https://cdn.example.com/products/foo.jpg", params)).toBeNull();
    expect(extractS3Key("https://s3.ru1.storage.beget.cloud/other-bucket/products/foo.jpg", params)).toBeNull();
  });

  it("returns null for keys outside the configured prefix", () => {
    expect(extractS3Key("banners/foo.jpg", params)).toBeNull();
    expect(extractS3Key("catalog/foo.jpg", params)).toBeNull();
  });

  it("returns null for empty or non-string values", () => {
    expect(extractS3Key("", params)).toBeNull();
    expect(extractS3Key("   ", params)).toBeNull();
    expect(extractS3Key(null, params)).toBeNull();
    expect(extractS3Key(undefined, params)).toBeNull();
  });

  it("returns null for absolute URLs when no public base is configured", () => {
    expect(
      extractS3Key("https://s3.ru1.storage.beget.cloud/5427be431039-dev/products/foo.jpg", {
        publicUrl: "",
        prefix: "products",
      }),
    ).toBeNull();
  });
});
