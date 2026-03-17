import { NextResponse } from "next/server";

import { normalizeAddressInput } from "@/shared/lib";
import { getAuthUserFromRequest } from "@/shared/lib/auth";
import { placeSandboxOrder } from "@/shared/lib/commerce";

export const runtime = "nodejs";

const CONFLICT_MESSAGES = new Set([
  "Cart is empty.",
  "One or more items are out of stock.",
  "Stock changed while checkout was processing.",
  "Checkout is being processed concurrently. Please retry.",
  "Coupon usage limit has been reached.",
  "Coupon was already used on this account.",
]);

function isValidationMessage(message) {
  return Boolean(
    message === "Missing checkout request id." ||
      message === "Shipping address is required." ||
      message === "Coupon was not found." ||
      message === "Coupon is not active yet." ||
      message === "Coupon has expired." ||
      message === "Coupon does not apply to this cart." ||
      message === "Enter a valid ZIP or postal code." ||
      message === "Enter a valid phone number." ||
      / is required\.$/.test(message) ||
      / must be \d+ characters or fewer\.$/.test(message),
  );
}

function getErrorResponse(error) {
  if (error instanceof SyntaxError) {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const message = error instanceof Error ? error.message : "Checkout failed.";

  if (CONFLICT_MESSAGES.has(message)) {
    return NextResponse.json({ error: message }, { status: 409 });
  }

  if (isValidationMessage(message)) {
    return NextResponse.json({ error: message }, { status: 400 });
  }

  console.error("Order API error:", error);
  return NextResponse.json({ error: "Checkout failed." }, { status: 500 });
}

export async function POST(req) {
  try {
    const user = await getAuthUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.isBlocked || user.deletedAt) {
      return NextResponse.json(
        { error: "Your account cannot place orders." },
        { status: 403 },
      );
    }

    const payload = await req.json();
    const address = normalizeAddressInput(payload?.address || {});
    const result = await placeSandboxOrder({
      userId: user.id,
      address,
      couponCode: payload?.couponCode,
      orderRequestId: payload?.orderRequestId,
    });

    return NextResponse.json(
      {
        message: result.created ? "Order created" : "Order already processed",
        order: result.order,
        summary: result.summary,
        created: result.created,
        status: 200,
      },
      { status: 200 },
    );
  } catch (error) {
    return getErrorResponse(error);
  }
}
