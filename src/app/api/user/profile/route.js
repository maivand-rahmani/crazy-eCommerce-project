import prisma from "../../../../../prisma/client";
import { NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/shared/lib/auth";

export const GET = async (req) => {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        password: true,
        Session: {
          select: { createdAt: true, expires: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!dbUser || !dbUser.id) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { password, Session, ...profile } = dbUser;

    return NextResponse.json(
      {
        data: {
          ...profile,
          hasPassword: Boolean(password),
          activeSessions: Session ?? [],
        },
        status: 200,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
};

export const PATCH = async (req) => {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = {};

    if (body.name !== undefined) {
      const name = typeof body.name === "string" ? body.name.trim() : "";
      if (!name || name.length > 100) {
        return NextResponse.json(
          { error: "Name must be 1-100 characters long." },
          { status: 400 },
        );
      }
      data.name = name;
    }

    if (body.image !== undefined) {
      const image = typeof body.image === "string" ? body.image.trim() : "";
      if (image && image.length > 2048) {
        return NextResponse.json(
          { error: "Image URL is too long." },
          { status: 400 },
        );
      }
      data.image = image || null;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "Nothing to update. Provide name and/or image." },
        { status: 400 },
      );
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ data: updated, status: 200 }, { status: 200 });
  } catch (error) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
};
