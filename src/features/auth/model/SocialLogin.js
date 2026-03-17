import { signIn } from "next-auth/react";

import { sanitizeRedirectPath } from "@/shared/lib";

export async function doSocialLogin(action, redirectTo = "/") {
  try {
    await signIn(action, {
      callbackUrl: sanitizeRedirectPath(redirectTo),
    });
  } catch (error) {
    return { error: error.message };
  }
}
