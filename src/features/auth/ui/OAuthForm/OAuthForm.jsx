import React from "react";
import { doSocialLogin } from "@/features/auth/model/SocialLogin";
import { useTranslations } from "next-intl";
import Image from "next/image";

const OAuthForm = ({ redirectTo = "/" }) => {
  const t = useTranslations("oauth");
  return (
    <div className="w-full space-y-3">
      <button
        type="button"
        onClick={() => doSocialLogin("google", redirectTo)}
        className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-border/60 bg-background px-4 py-3 text-sm font-medium text-text shadow-sm transition hover:border-border hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <Image
          src="/icons/google-color.png"
          width={18}
          height={18}
          alt="Google"
        />
        <span>{t("continueWithGoogle")}</span>
      </button>

      <button
        type="button"
        onClick={() => doSocialLogin("github", redirectTo)}
        className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-border/60 bg-background px-4 py-3 text-sm font-medium text-text shadow-sm transition hover:border-border hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <Image src="/icons/github.png" width={18} height={18} alt="GitHub" />
        <span>{t("continueWithGithub")}</span>
      </button>
    </div>
  );
};

export default OAuthForm;
