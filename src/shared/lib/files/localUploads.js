"use server";

import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const ADMIN_UPLOAD_DIR = path.join(PUBLIC_DIR, "uploads", "admin");
const ADMIN_UPLOAD_PREFIX = "/uploads/admin";

function getExtension(file) {
  if (!file?.name) return ".bin";
  const ext = path.extname(file.name).toLowerCase();
  return ext || ".bin";
}

function sanitizeSegment(value) {
  return `${value || "file"}`.replace(/[^a-zA-Z0-9-_]/g, "-");
}

export async function saveLocalUpload(file, segments = []) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const dir = path.join(ADMIN_UPLOAD_DIR, ...segments.map(sanitizeSegment));
  await mkdir(dir, { recursive: true });

  const fileName = `${Date.now()}-${crypto.randomUUID()}${getExtension(file)}`;
  const filePath = path.join(dir, fileName);
  await writeFile(filePath, buffer);

  return `${ADMIN_UPLOAD_PREFIX}/${segments.map(sanitizeSegment).join("/")}/${fileName}`;
}

export async function deleteLocalUpload(url) {
  if (!url || typeof url !== "string") return;
  if (!url.startsWith(ADMIN_UPLOAD_PREFIX)) return;

  const relativePath = url.replace(ADMIN_UPLOAD_PREFIX, "").replace(/^\//, "");
  const filePath = path.join(ADMIN_UPLOAD_DIR, relativePath);

  if (!filePath.startsWith(ADMIN_UPLOAD_DIR)) return;

  await rm(filePath, { force: true });
}
