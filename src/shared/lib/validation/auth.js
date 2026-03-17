const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[\p{L}][\p{L}\p{M}' -]*$/u;

export function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function normalizeName(value) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

export function validateEmail(value) {
  const email = normalizeEmail(value);

  if (!email || !EMAIL_REGEX.test(email)) {
    throw new Error("Enter a valid email address.");
  }

  return email;
}

export function validatePassword(value) {
  const password = typeof value === "string" ? value : "";

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }

  if (password.length > 72) {
    throw new Error("Password is too long.");
  }

  return password;
}

export function validatePersonName(value, label) {
  const normalizedValue = normalizeName(value);

  if (normalizedValue.length < 2) {
    throw new Error(`${label} must be at least 2 characters long.`);
  }

  if (normalizedValue.length > 40) {
    throw new Error(`${label} must be 40 characters or fewer.`);
  }

  if (!NAME_REGEX.test(normalizedValue)) {
    throw new Error(`${label} can only contain letters, spaces, apostrophes, and hyphens.`);
  }

  return normalizedValue;
}

export function validateRegistrationPayload(payload = {}) {
  return {
    firstname: validatePersonName(payload.firstname, "First name"),
    lastname: validatePersonName(payload.lastname, "Last name"),
    email: validateEmail(payload.email),
    password: validatePassword(payload.password),
  };
}

export function sanitizeRedirectPath(value, fallback = "/") {
  if (typeof value !== "string") return fallback;

  const trimmedValue = value.trim();

  if (!trimmedValue.startsWith("/") || trimmedValue.startsWith("//")) {
    return fallback;
  }

  return trimmedValue;
}
