// src/actions/initUser.js
"use server";

import { ensureUserInDB } from "../ensureUserInDB";

export async function initUser() {
  await ensureUserInDB();
}
