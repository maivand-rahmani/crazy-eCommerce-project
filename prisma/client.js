import { PrismaClient } from "@prisma/client";
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ["error", "warn"]
}).$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma