import prisma from "../../../../prisma/client";
import { ensureSuperAdminAction } from "@/features/admin-common";
import { revalidateLocalizedPaths } from "@/shared/lib/admin/revalidate";
import { DEFAULT_SETTINGS } from "./defaults";

export { DEFAULT_SETTINGS };

let cachedSettings = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000;

export async function getSettings() {
  const now = Date.now();
  if (cachedSettings && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedSettings;
  }

  const rows = await prisma.appSetting.findMany();
  const settings = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    settings[row.key] = row.value;
  }

  cachedSettings = settings;
  cacheTimestamp = now;
  return settings;
}

export async function getSetting(key) {
  const settings = await getSettings();
  return settings[key] ?? DEFAULT_SETTINGS[key] ?? null;
}

export async function updateSetting(key, value, changedBy) {
  const user = await ensureSuperAdminAction();

  const existing = await prisma.appSetting.findUnique({ where: { key } });
  const oldValue = existing?.value ?? DEFAULT_SETTINGS[key] ?? null;

  const updated = await prisma.appSetting.upsert({
    where: { key },
    update: { value, updatedBy: changedBy || user.id },
    create: { key, value, updatedBy: changedBy || user.id },
  });

  await prisma.settingsAuditLog.create({
    data: {
      key,
      oldValue: oldValue !== null && oldValue !== undefined ? oldValue : undefined,
      newValue: value,
      changedBy: changedBy || user.id,
    },
  });

  cachedSettings = null;
  cacheTimestamp = 0;

  revalidateLocalizedPaths(["/admin/settings", "/contact", "/"]);
  return updated;
}

export async function seedSettings() {
  const rows = await prisma.appSetting.findMany({ select: { key: true } });
  const existingKeys = new Set(rows.map((r) => r.key));
  const toCreate = Object.entries(DEFAULT_SETTINGS)
    .filter(([k]) => !existingKeys.has(k))
    .map(([key, value]) => ({ key, value }));

  if (toCreate.length > 0) {
    await prisma.appSetting.createMany({ data: toCreate, skipDuplicates: true });
  }
  cachedSettings = null;
  return toCreate.length;
}

export function clearSettingsCache() {
  cachedSettings = null;
  cacheTimestamp = 0;
}

// Sync accessor for non-async contexts (returns cached or defaults without DB hit)
export function getCachedSettingsSync() {
  return cachedSettings || { ...DEFAULT_SETTINGS };
}
