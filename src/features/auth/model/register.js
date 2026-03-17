"use server";

import { Fetch } from "@/shared/lib/fetch";
import { validateRegistrationPayload } from "@/shared/lib";

export async function register(data) {
  const payload = validateRegistrationPayload(data);
  return Fetch("/api/auth/register", "POST", payload);
}
