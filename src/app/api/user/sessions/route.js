import prisma from "../../../../../prisma/client";
import { NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/shared/lib/auth";

// Revoke all other sessions for the current user.
// NOTE: the app uses JWT sessions, so DB Session rows are best-effort
// (OAuth joins). Deleting them still signs out DB-backed sessions.
export const DELETE = async (req) => {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { count } = await prisma.session.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json(
      { data: { revoked: count }, status: 200 },
      { status: 200 },
    );
  } catch (error) {
    console.error("Sessions DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to revoke sessions" },
      { status: 500 },
    );
  }
};
