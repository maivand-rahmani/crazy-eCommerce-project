import { hash } from "bcrypt";
import { NextResponse } from "next/server";

import prisma from "../../../../../prisma/client";
import { sanitizeUser } from "@/shared/lib/auth";
import { validateRegistrationPayload } from "@/shared/lib";

export async function POST(req) {
  try {
    const payload = validateRegistrationPayload(await req.json());

    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const hashedPassword = await hash(payload.password, 10);

    const user = await prisma.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        name: `${payload.firstname} ${payload.lastname}`,
        role: "user",
        addresses: [],
      },
    });

    return NextResponse.json(
      {
        user: sanitizeUser(user),
        status: 201,
      },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Registration could not be completed.";

    const status =
      message === "An account with this email already exists." ? 409 : 400;

    return NextResponse.json({ error: message }, { status });
  }
}
