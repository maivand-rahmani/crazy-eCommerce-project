import { NextResponse } from "next/server";

import { getAuthUserFromRequest } from "@/shared/lib/auth";
import { getCouponPreview } from "@/shared/lib/commerce";

export async function GET(req) {
  try {
    const user = await getAuthUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const couponCode = req.nextUrl.searchParams.get("coupon") || "";
    const preview = await getCouponPreview({
      userId: user.id,
      couponCode,
    });

    return NextResponse.json(preview);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Coupon could not be applied.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
