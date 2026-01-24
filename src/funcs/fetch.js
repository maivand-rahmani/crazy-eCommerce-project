export default async function Fetch(url, method = "GET", token, body) {
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
 

  return res.json();
}
