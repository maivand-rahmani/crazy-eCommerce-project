"use server";

import { compare } from "bcrypt";

import { sanitizeUser } from "@/shared/lib/auth";
import { validateEmail, validatePassword } from "@/shared/lib";
import { getUserByEmail } from "./getUserByEmail";

export async function authorizeUser(credentials = {}) {
  const email = validateEmail(credentials.email);
  const password = validatePassword(credentials.password);

  const user = await getUserByEmail(email);

  if (!user || !user.password) {
    throw new Error("Invalid email or password.");
  }

  if (user.deletedAt) {
    throw new Error("This account is disabled.");
  }

  if (user.isBlocked) {
    throw new Error("This account is blocked.");
  }

  const passwordMatch = await compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid email or password.");
  }

  return sanitizeUser(user);
}
