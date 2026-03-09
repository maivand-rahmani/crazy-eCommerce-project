import prisma from "../../../../../prisma/client";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST(req) {
  try {
    const { email, password, firstname, lastname } = await req.json();

    if (!email || !password || !firstname || !lastname) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.User.create({
      data: {
        email,
        password: hashedPassword,
        name: `${firstname} ${lastname}`,
        role: "user",
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 });
  }
}
