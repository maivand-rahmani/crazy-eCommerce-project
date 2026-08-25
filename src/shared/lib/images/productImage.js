const DEFAULT_S3_HOST = "s3.ru1.storage.beget.cloud";
const PRODUCT_IMAGE_PLACEHOLDER = "/icons/product-placeholder.svg";

function getPublicUrlBase() {
  const publicUrl = process.env.NEXT_PUBLIC_S3_PUBLIC_URL;
  if (publicUrl) {
    return publicUrl.replace(/\/+$/, "");
  }

  const bucket = process.env.NEXT_PUBLIC_S3_BUCKET;
  if (!bucket) {
    return "";
  }

  // Beget-compatible default derived from the configured bucket.
  return `https://${DEFAULT_S3_HOST}/${bucket}`;
}

function getProductPrefix() {
  return `${process.env.NEXT_PUBLIC_S3_PRODUCT_PREFIX || "products"}`.replace(
    /^\/+|\/+$/g,
    "",
  );
}

/**
 * Normalizes a stored product image value (URL or S3 key/filename) into a
 * public URL.
 *
 * - Absolute `http(s)://` URLs are returned unchanged.
 * - Keys/filenames (e.g. `unnamed.jpg`) are prefixed with the public base and
 *   the configured product prefix: `<NEXT_PUBLIC_S3_PUBLIC_URL>/products/...`.
 * - Values already starting with the configured product prefix (e.g.
 *   `products/...`) are not double-prefixed.
 * - Each path segment is encoded separately so `/` between key segments is
 *   preserved (not turned into `%2F`).
 * - Legacy local `/uploads/...` paths are not turned into bogus S3 URLs and
 *   fall back to the shared placeholder.
 * - An empty/blank value falls back to the shared placeholder.
 *
 * @param {string} imageUrl
 * @returns {string}
 */
export function getProductImageUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.trim()) {
    return PRODUCT_IMAGE_PLACEHOLDER;
  }

  const value = imageUrl.trim();

  // Already an absolute URL — return as-is.
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  // Legacy local uploads — do not turn into bogus S3 URLs.
  if (value.startsWith("/uploads")) {
    return PRODUCT_IMAGE_PLACEHOLDER;
  }

  const base = getPublicUrlBase();
  if (!base) {
    return PRODUCT_IMAGE_PLACEHOLDER;
  }

  const prefix = getProductPrefix();
  const normalizedValue = value.replace(/^\/+/, "");

  // Already carries the product prefix — do not duplicate it.
  const key = normalizedValue.startsWith(`${prefix}/`)
    ? normalizedValue
    : `${prefix}/${normalizedValue}`;

  // Encode each path segment separately so `/` between segments is preserved.
  return `${base}/${key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
}

export { PRODUCT_IMAGE_PLACEHOLDER };
