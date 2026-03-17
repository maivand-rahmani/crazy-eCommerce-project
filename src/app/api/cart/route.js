import { NextResponse } from "next/server";

import { getAuthUserFromRequest } from "@/shared/lib/auth";
import { getCartSummaryForUser } from "@/shared/lib/commerce";

export async function GET(req) {
  try {
    const user = await getAuthUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await getCartSummaryForUser(user.id);

    return NextResponse.json({
      data: cart.items,
      summary: cart.summary,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch cart." },
      { status: 500 },
    );
  }
}
