export default async function Fetch(url, method = "GET", token, body) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${url}`,
    {
      method,
      cache: "force-cache", // или no-store
      next: { revalidate: 60 },
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    }
  );

  if (!res.ok) {
    throw new Error(`Fetch error: ${res.status}`);
  }

  return res.json();
}
