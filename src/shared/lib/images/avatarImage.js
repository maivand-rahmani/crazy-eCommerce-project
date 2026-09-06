const DEFAULT_S3_HOST = "s3.ru1.storage.beget.cloud";
const AVATAR_IMAGE_PLACEHOLDER = "/icons/profile-circle-svgrepo-com.svg";

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

function getAvatarPrefix() {
  return `${process.env.NEXT_PUBLIC_S3_AVATAR_PREFIX || "users/icons"}`.replace(
    /^\/+|\/+$/g,
    "",
  );
}

/**
 * Normalizes a stored avatar value (URL or S3 key) into a public URL.
 *
 * - Absolute `http(s)://` URLs are returned unchanged.
 * - Keys (e.g. `users/icons/<userId>/<uuid>.jpg`) are prefixed with the public
 *   base: `<NEXT_PUBLIC_S3_PUBLIC_URL>/users/icons/...`.
 * - Values already starting with the configured avatar prefix are not
 *   double-prefixed; bare filenames get the prefix applied.
 * - Each path segment is encoded separately so `/` between key segments is
 *   preserved (not turned into `%2F`).
 * - Legacy local `/uploads/...` paths and empty values fall back to the
 *   shared profile placeholder.
 *
 * @param {string} imageUrl
 * @returns {string}
 */
export function getAvatarImageUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.trim()) {
    return AVATAR_IMAGE_PLACEHOLDER;
  }

  const value = imageUrl.trim();

  // Already an absolute URL — return as-is.
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  // Legacy local uploads — do not turn into bogus S3 URLs.
  if (value.startsWith("/uploads")) {
    return AVATAR_IMAGE_PLACEHOLDER;
  }

  const base = getPublicUrlBase();
  if (!base) {
    return AVATAR_IMAGE_PLACEHOLDER;
  }

  const prefix = getAvatarPrefix();
  const normalizedValue = value.replace(/^\/+/, "");

  // Already carries the avatar prefix — do not duplicate it.
  const key = normalizedValue.startsWith(`${prefix}/`)
    ? normalizedValue
    : `${prefix}/${normalizedValue}`;

  // Encode each path segment separately so `/` between segments is preserved.
  return `${base}/${key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
}

export { AVATAR_IMAGE_PLACEHOLDER };
