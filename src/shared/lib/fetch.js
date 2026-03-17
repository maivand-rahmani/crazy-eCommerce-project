"use server";

import { cookies } from "next/headers";

function getBaseUrl() {
  const configuredUrl =
    process.env.INTERNAL_APP_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "test") {
    return "http://localhost:3000";
  }

  return "http://127.0.0.1:3000";
}

function shouldSendBody(method, body) {
  return method !== "GET" && method !== "HEAD" && body !== undefined;
}

export async function Fetch(url, method = "GET", body, legacyBody) {
  const requestBody = legacyBody !== undefined ? legacyBody : body;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const normalizedMethod = `${method || "GET"}`.toUpperCase();

  const res = await fetch(`${getBaseUrl()}${url}`, {
    method: normalizedMethod,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...(shouldSendBody(normalizedMethod, requestBody)
        ? { "Content-Type": "application/json" }
        : {}),
    },
    body: shouldSendBody(normalizedMethod, requestBody)
      ? JSON.stringify(requestBody)
      : undefined,
  });

  const contentType = res.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    if (res.ok) {
      return { status: res.status };
    }

    return {
      error: res.statusText || "Request failed",
      status: res.status,
    };
  }

  const data = await res.json();

  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === "object" && data.status == null) {
    return {
      ...data,
      status: res.status,
    };
  }

  return data;
}
