"use server"
import { getUserByEmail } from "./getUserByEmail";
import { compare } from "bcrypt";

export async function authorizeUser(credentials) {
  const { email, password } = credentials;

  if (!email || !password) throw new Error("Missing credentials");

  const user = await getUserByEmail(email);
  if (!user) throw new Error("User not found");

  const passwordMatch = await compare(password, user.password);
  if (!passwordMatch) throw new Error("Incorrect password");

  return user;
}
