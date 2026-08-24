const DEFAULT_S3_HOST = "s3-nl.hostkey.com";
const DEFAULT_S3_BUCKET = "b0ef80df8-dev";
const DEFAULT_PRODUCT_PREFIX = "products";
const PRODUCT_IMAGE_PLACEHOLDER = "/icons/product-placeholder.svg";

function getPublicUrlBase() {
  const publicUrl = process.env.NEXT_PUBLIC_S3_PUBLIC_URL;
  if (publicUrl) {
    return publicUrl.replace(/\/+$/, "");
  }

  const bucket = process.env.NEXT_PUBLIC_S3_BUCKET || DEFAULT_S3_BUCKET;
  return `https://${DEFAULT_S3_HOST}/${bucket}`;
}

/**
 * Normalizes a stored product image value (URL or S3 key/filename) into a
 * public URL.
 *
 * - Absolute `http(s)://` URLs are returned unchanged.
 * - Keys/filenames (e.g. `unnamed.jpg`) are prefixed with the public base and
 *   the product prefix: `https://s3-nl.hostkey.com/b0ef80df8-dev/products/...`.
 * - Values already starting with the product prefix (e.g. `products/...`) are
 *   not double-prefixed.
 * - Each path segment is encoded separately so `/` between key segments is
 *   preserved (not turned into `%2F`).
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

  const prefix = process.env.NEXT_PUBLIC_S3_PRODUCT_PREFIX || DEFAULT_PRODUCT_PREFIX;
  const normalizedValue = value.replace(/^\/+/, "");
  const key = normalizedValue.startsWith(`${prefix}/`)
    ? normalizedValue
    : `${prefix}/${normalizedValue}`;

  // Already carries the product prefix — do not duplicate it.
  if (normalizedValue.startsWith(`${prefix}/`)) {
    return `${getPublicUrlBase()}/${key
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/")}`;
  }

  // Encode each path segment separately so `/` between segments is preserved.
  const segments = normalizedValue
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${getPublicUrlBase()}/${prefix}/${segments}`;
}

export { PRODUCT_IMAGE_PLACEHOLDER };
