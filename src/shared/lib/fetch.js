"use server";
import { cookies } from "next/headers";

export default async function Fetch(url, method = "GET", userToken = null, body) {
  const cookiesStore = await cookies();
  const token = userToken || cookiesStore.get("next-auth.session-token")?.value;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${url}`,
    {
      method,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    }
  );
 

  return res && res.json();
}
