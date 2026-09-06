import 'dotenv/config'
import { defineConfig } from "prisma/config";

// `prisma generate` never connects to the database, so fall back to a
// placeholder when DATABASE_URL is absent (e.g. Vercel preview builds).
// migrate commands still require the real DATABASE_URL.
const PLACEHOLDER_URL = "postgresql://placeholder:***@localhost:59999/placeholder";

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { 
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: { 
    url: process.env.DATABASE_URL || PLACEHOLDER_URL,
  }
});
