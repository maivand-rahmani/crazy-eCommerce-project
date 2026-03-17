const TEST_AUTH_SECRET = "test-nextauth-secret";

export function getAuthSecret() {
  const secret = process.env.NEXTAUTH_SECRET?.trim();

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === "test") {
    return TEST_AUTH_SECRET;
  }

  throw new Error(
    "Missing NEXTAUTH_SECRET. Add it to your environment before starting the app.",
  );
}
