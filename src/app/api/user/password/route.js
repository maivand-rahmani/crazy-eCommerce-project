import { compare, hash } from "bcrypt";
import prisma from "../../../../../prisma/client";
import { NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/shared/lib/auth";
import { validatePassword } from "@/shared/lib/validation/auth";

export const PUT = async (req) => {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current and new password are required." },
        { status: 400 },
      );
    }

    try {
      validatePassword(newPassword);
    } catch (validationError) {
      return NextResponse.json(
        { error: validationError.message },
        { status: 400 },
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: "New password must be different from the current one." },
        { status: 400 },
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, password: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!dbUser.password) {
      return NextResponse.json(
        {
          error:
            "This account uses OAuth sign-in and has no password to change.",
        },
        { status: 400 },
      );
    }

    const passwordMatch = await compare(currentPassword, dbUser.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { password: await hash(newPassword, 10) },
    });

    return NextResponse.json(
      { message: "Password changed successfully", status: 200 },
      { status: 200 },
    );
  } catch (error) {
    console.error("Password PUT error:", error);
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 },
    );
  }
};
