const DEFAULT_PRODUCT_PREFIX = "products";

const ALLOWED_IMAGE_EXTENSIONS = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

/**
 * Normalizes an S3 endpoint by stripping trailing slashes.
 * @param {string} endpoint
 * @returns {string}
 */
export function normalizeEndpoint(endpoint) {
  return `${endpoint || ""}`.replace(/\/+$/, "");
}

/**
 * Returns the configured product image prefix (env-driven, no leading/trailing
 * slashes). Falls back to "products".
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {string}
 */
export function getProductPrefix(env = process.env) {
  return `${env.NEXT_PUBLIC_S3_PRODUCT_PREFIX || DEFAULT_PRODUCT_PREFIX}`.replace(
    /^\/+|\/+$/g,
    "",
  );
}

/**
 * Maps an allowed image MIME type to its file extension, or null when the
 * MIME type is not supported.
 * @param {string} mimeType
 * @returns {string|null}
 */
export function getImageExtension(mimeType) {
  return ALLOWED_IMAGE_EXTENSIONS[mimeType] || null;
}

/**
 * Sanitizes a single key segment so it is safe to use inside an S3 object key.
 * @param {*} value
 * @returns {string}
 */
export function sanitizeSegment(value) {
  return `${value ?? ""}`.replace(/[^a-zA-Z0-9-_]/g, "-");
}

/**
 * Builds an S3 object key from the configured prefix, extra segments and a
 * file name: `<prefix>/<segment>/.../<fileName>`.
 * @param {{ prefix: string, segments?: Array<*>, fileName: string }} params
 * @returns {string}
 */
export function buildS3Key({ prefix, segments = [], fileName }) {
  const safeSegments = segments.map(sanitizeSegment).filter(Boolean);
  return [prefix, ...safeSegments, fileName].filter(Boolean).join("/");
}

/**
 * Safely extracts an S3 object key from a stored value (plain key or public
 * URL). Returns null for legacy local uploads, foreign absolute URLs and keys
 * outside the configured product prefix.
 * @param {string} storedValue
 * @param {{ publicUrl?: string, prefix: string }} params
 * @returns {string|null}
 */
export function extractS3Key(storedValue, { publicUrl, prefix }) {
  if (!storedValue || typeof storedValue !== "string") return null;

  const value = storedValue.trim();
  if (!value) return null;

  // Legacy local uploads — never touch.
  if (value.startsWith("/uploads")) return null;

  let key = value;

  // Absolute URLs: only allow ones pointing at the configured public base.
  if (/^https?:\/\//i.test(value)) {
    if (!publicUrl) return null;
    const base = normalizeEndpoint(publicUrl);
    if (!value.startsWith(`${base}/`)) return null;
    key = value.slice(base.length + 1);
  }

  key = key.replace(/^\/+/, "");

  if (!key.startsWith(`${prefix}/`)) return null;

  return key;
}
