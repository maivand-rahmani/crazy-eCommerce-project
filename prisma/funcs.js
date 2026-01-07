 import { PrismaClient } from '@prisma/client' 

const prisma = new PrismaClient()

export async function getProducts() {
  const res = await prisma.categories.findMany()
  const data = await res.json();
  return await data;
}

export function serializeBigInt(obj) {
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (typeof obj === "bigint") return obj.toString();
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, serializeBigInt(v)])
    );
  }
  return obj;
}

export function toSafeJson(obj) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint"
        ? Number(value)
        : value instanceof Date
        ? value.toISOString()
        : value
    )
  );
}