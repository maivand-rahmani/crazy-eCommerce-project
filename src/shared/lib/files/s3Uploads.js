"use server";

import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import crypto from "node:crypto";

import {
  buildS3Key,
  extractS3Key,
  getAvatarPrefix,
  getImageExtension,
  getProductPrefix,
  normalizeEndpoint,
} from "./s3KeyUtils";

let s3Client = null;

function getRequiredEnv() {
  const accessKeyId = process.env.S3_ACCESS_KEY;
  const secretAccessKey = process.env.S3_SECRET_KEY;
  const endpoint = process.env.S3_HOST;
  const bucket = process.env.NEXT_PUBLIC_S3_BUCKET;

  if (!accessKeyId || !secretAccessKey || !endpoint || !bucket) {
    throw new Error(
      "S3 storage is not configured. Set S3_ACCESS_KEY, S3_SECRET_KEY, S3_HOST and NEXT_PUBLIC_S3_BUCKET.",
    );
  }

  return {
    accessKeyId,
    secretAccessKey,
    endpoint: normalizeEndpoint(endpoint),
    bucket,
  };
}

function getS3Client() {
  if (s3Client) return s3Client;

  const { accessKeyId, secretAccessKey, endpoint } = getRequiredEnv();
  const region = process.env.S3_REGION || "us-east-1";
  const forcePathStyle = process.env.S3_FORCE_PATH_STYLE !== "false";

  s3Client = new S3Client({
    region,
    endpoint,
    forcePathStyle,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return s3Client;
}

/**
 * Uploads an image File to the configured S3 bucket and returns the object
 * key (e.g. `products/<productId>/<uuid>.jpg`). The key is built from the
 * configured NEXT_PUBLIC_S3_PRODUCT_PREFIX plus the provided segments, so the
 * prefix is never hardcoded here.
 *
 * @param {File} file - Web File with a supported image MIME type.
 * @param {Array<*>} [segments] - Extra key segments (e.g. product/variant ids).
 * @returns {Promise<string>} The stored S3 object key.
 */
export async function uploadS3Image(file, segments = []) {
  if (!file || typeof file.arrayBuffer !== "function") {
    throw new Error("Invalid image file.");
  }

  const extension = getImageExtension(file.type);
  if (!extension) {
    throw new Error("Only JPG, PNG, and WebP images are supported.");
  }

  const { bucket } = getRequiredEnv();
  const client = getS3Client();

  const body = Buffer.from(await file.arrayBuffer());
  const key = buildS3Key({
    prefix: getProductPrefix(),
    segments,
    fileName: `${crypto.randomUUID()}${extension}`,
  });

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: file.type,
      ContentLength: body.length,
    }),
  );

  return key;
}

/**
 * Deletes an S3 object by its stored key or public URL. Only keys under the
 * configured product prefix of the configured bucket are ever deleted; legacy
 * local `/uploads` paths and foreign absolute URLs are skipped.
 *
 * @param {string} storedValue - Stored key or public URL.
 * @returns {Promise<void>}
 */
export async function deleteS3Image(storedValue) {
  const key = extractS3Key(storedValue, {
    publicUrl: process.env.NEXT_PUBLIC_S3_PUBLIC_URL,
    prefix: getProductPrefix(),
  });

  if (!key) return;

  const { bucket } = getRequiredEnv();
  const client = getS3Client();

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}

/**
 * Uploads a user avatar File to the configured S3 bucket and returns the
 * object key (e.g. `users/icons/<userId>/<uuid>.jpg`). The key is built from
 * the configured NEXT_PUBLIC_S3_AVATAR_PREFIX plus the provided user segment,
 * so the prefix is never hardcoded here. Same JPG/PNG/WebP validation as
 * product images.
 *
 * @param {File} file - Web File with a supported image MIME type.
 * @param {*} userId - User id used as a key segment.
 * @returns {Promise<string>} The stored S3 object key.
 */
export async function uploadAvatarImage(file, userId) {
  if (!file || typeof file.arrayBuffer !== "function") {
    throw new Error("Invalid image file.");
  }

  const extension = getImageExtension(file.type);
  if (!extension) {
    throw new Error("Only JPG, PNG, and WebP images are supported.");
  }

  const { bucket } = getRequiredEnv();
  const client = getS3Client();

  const body = Buffer.from(await file.arrayBuffer());
  const key = buildS3Key({
    prefix: getAvatarPrefix(),
    segments: [userId],
    fileName: `${crypto.randomUUID()}${extension}`,
  });

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: file.type,
      ContentLength: body.length,
    }),
  );

  return key;
}

/**
 * Deletes a user avatar S3 object by its stored key or public URL. Only keys
 * under the configured avatar prefix of the configured bucket are ever
 * deleted; legacy local `/uploads` paths and foreign absolute URLs are
 * skipped (best-effort cleanup).
 *
 * @param {string} storedValue - Stored key or public URL.
 * @returns {Promise<void>}
 */
export async function deleteAvatarImage(storedValue) {
  const key = extractS3Key(storedValue, {
    publicUrl: process.env.NEXT_PUBLIC_S3_PUBLIC_URL,
    prefix: getAvatarPrefix(),
  });

  if (!key) return;

  const { bucket } = getRequiredEnv();
  const client = getS3Client();

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}
