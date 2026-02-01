// src/actions/initUser.js
"use server";

import { ensureUserInDB } from "@/entities/user/model/ensureUserInDB";

export async function initUser() {
  await ensureUserInDB();
}
