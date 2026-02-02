import prisma from "../../../../../prisma/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password, firstname, lastname } = await req.json();

    if (!email || !password || !firstname || !lastname) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = await prisma.User.create({
      data: {
        email,
        password,
        name: `${firstname} ${lastname}`,
        role: "user",
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
