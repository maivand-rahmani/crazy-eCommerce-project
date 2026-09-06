import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { getAuthUserFromRequest } from "@/shared/lib/auth";
import {
  deleteAvatarImage,
  uploadAvatarImage,
} from "@/shared/lib/files/s3Uploads";
import { getAvatarImageUrl } from "@/shared/lib/images/avatarImage";
import { getImageExtension } from "@/shared/lib/files/s3KeyUtils";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export const POST = async (req) => {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let formData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json(
        { error: "Invalid multipart body." },
        { status: 400 },
      );
    }

    const file = formData.get("avatar");
    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json(
        { error: "Avatar file is required (field: avatar)." },
        { status: 400 },
      );
    }

    if (!ALLOWED_MIME.has(file.type) || !getImageExtension(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, and WebP images are supported." },
        { status: 400 },
      );
    }

    if (file.size > MAX_AVATAR_BYTES) {
      return NextResponse.json(
        { error: "Avatar must be 5MB or smaller." },
        { status: 400 },
      );
    }

    // Remember the old stored value so the previous S3 object can be cleaned
    // up best-effort (foreign absolute URLs are skipped inside the helper).
    const existing = await prisma.user.findUnique({
      where: { id: user.id },
      select: { image: true },
    });

    const key = await uploadAvatarImage(file, user.id);
    const url = getAvatarImageUrl(key);

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { image: url },
      select: { id: true, image: true, updatedAt: true },
    });

    // Best-effort cleanup of the previous S3 avatar — never fail the upload.
    if (existing?.image && existing.image !== url) {
      try {
        await deleteAvatarImage(existing.image);
      } catch (error) {
        console.warn("Failed to delete old avatar:", error?.message || error);
      }
    }

    return NextResponse.json({ data: updated, url }, { status: 200 });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload avatar" },
      { status: 500 },
    );
  }
};
