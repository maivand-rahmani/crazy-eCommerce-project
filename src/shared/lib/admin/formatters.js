import { LOW_STOCK_THRESHOLD } from "./constants";

export function parsePage(value, fallback = 1) {
  const page = Number.parseInt(value || `${fallback}`, 10);
  return Number.isFinite(page) && page > 0 ? page : fallback;
}

export function buildPagination({ total, page, pageSize }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return {
    total,
    page: Math.min(page, totalPages),
    pageSize,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
}

export function formatCurrency(cents) {
  const value = Number(cents || 0) / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value, options) {
  if (!value) return "-";

  return new Intl.DateTimeFormat(
    "en-US",
    options || {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(new Date(value));
}

export function formatDateTime(value) {
  return formatDate(value, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getStockTone(quantity, threshold = LOW_STOCK_THRESHOLD) {
  if (quantity <= 0) return "danger";
  if (quantity <= threshold) return "warning";
  return "success";
}

export function isAllowedImageFile(file) {
  return Boolean(
    file &&
      typeof file === "object" &&
      typeof file.name === "string" &&
      file.size > 0 &&
      ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
  );
}

export function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeOptionalNumber(value) {
  if (value === "" || value === null || value === undefined) return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function normalizeOptionalBigInt(value) {
  if (value === "" || value === null || value === undefined) return null;

  try {
    return BigInt(`${value}`);
  } catch {
    return null;
  }
}

export function normalizeOptionalDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function groupPairs(items = []) {
  return items
    .filter((item) => normalizeText(item?.key))
    .map((item) => ({
      key: normalizeText(item.key),
      value: normalizeText(item.value),
    }));
}

export function pairsToRecord(items = []) {
  return items.reduce((acc, item) => {
    if (item.key) {
      acc[item.key] = item.value;
    }
    return acc;
  }, {});
}
