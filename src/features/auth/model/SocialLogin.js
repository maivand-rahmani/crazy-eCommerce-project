import { signIn } from "next-auth/react";

export async function doSocialLogin(action) {
  try {
    await signIn(action, { redirectTo: "/" });
  } catch (error) {
    return { error: error.message };
  }
}