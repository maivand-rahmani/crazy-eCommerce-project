"use server";
import { cookies } from "next/headers";

export async function Fetch(url, method = "GET" , body) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("next-auth.session-token")?.value; 

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
