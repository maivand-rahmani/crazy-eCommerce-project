import React from "react";
import { doSocialLogin } from "@/features/auth/model/SocialLogin";
import { useTranslations } from "next-intl";

const OAuthForm = () => {
  const t = useTranslations("oauth");
  return (
    <form action={doSocialLogin} className="w-full space-y-3 px-10">
      <button
        type="button"
        onClick={() => doSocialLogin("google")}
        className="w-full inline-flex items-center justify-center gap-3 rounded-lg border bg-background px-4 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <img
          src="/icons/google-color.png"
          width={18}
          height={18}
          alt="Sign in with Google"
        />
        <span>{t("continueWithGoogle")}</span>
      </button>

      <button
        type="button"
        onClick={() => doSocialLogin("github")}
        className="w-full inline-flex items-center justify-center gap-3 rounded-lg border bg-background px-4 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <img src="/icons/github.png" width={18} height={18} alt="GitHub" />
        <span>{t("continueWithGithub")}</span>
      </button>
    </form>
  );
};

export default OAuthForm;
