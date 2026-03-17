"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useTranslations } from "next-intl";

import LoginForm from "./forms/LoginForm";
import RegisterForm from "./forms/RegisterForm";
import OAuthForm from "./OAuthForm/OAuthForm";

const AuthFormLayout = ({ redirectTo = "/" }) => {
  const t = useTranslations("auth");
  const tLogin = useTranslations("auth.login");
  const tRegister = useTranslations("auth.register");
  const [form, setForm] = useState("login");

  return (
    <main className="grid min-h-screen w-full overflow-hidden rounded-[32px] border border-border/60 bg-card/90 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.4)] lg:grid-cols-[minmax(0,540px)_minmax(0,1fr)]">
      <section className="flex flex-col justify-center gap-6 px-6 py-10 sm:px-10 lg:px-12">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Sandbox Store Access
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-text sm:text-4xl">
            {form === "login" ? tLogin("title") : tRegister("title")}
          </h1>
          <p className="max-w-md text-sm leading-6 text-unactive-text">
            {form === "login" ? tLogin("subtitle") : tRegister("subtitle")}
          </p>
        </div>

        <div className="rounded-[28px] border border-border/60 bg-background/70 p-5 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.3)] backdrop-blur-xl">
          {form === "login" ? (
            <LoginForm redirectTo={redirectTo} />
          ) : (
            <RegisterForm redirectTo={redirectTo} />
          )}
        </div>

        <div className="flex items-center gap-3 text-sm text-unactive-text">
          <span className="h-px flex-1 bg-border/70" />
          <span>{t("orContinueWith")}</span>
          <span className="h-px flex-1 bg-border/70" />
        </div>

        <OAuthForm redirectTo={redirectTo} />

        <div className="text-sm text-unactive-text">
          <span>
            {form === "login" ? tLogin("noAccount") : tRegister("hasAccount")}
          </span>{" "}
          <button
            type="button"
            onClick={() => setForm(form === "login" ? "register" : "login")}
            className="font-medium text-text underline underline-offset-4 transition hover:text-primary"
          >
            {form === "login" ? tLogin("register") : tRegister("login")}
          </button>
        </div>
      </section>

      <section className="relative hidden min-h-[720px] overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.16),transparent_28%),linear-gradient(160deg,#08111f_0%,#12253d_55%,#0d1728_100%)] lg:block">
        <Image
          src="https://burst.shopifycdn.com/photos/city-lights-through-rain-window.jpg?width=1600&format=pjpg&exif=0&iptc=0"
          alt="Rainy city lights behind a storefront window"
          fill
          priority
          className="object-cover opacity-35 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,31,0.22),rgba(8,17,31,0.78))]" />
        <div className="relative flex h-full flex-col justify-between p-10 text-white">
          <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.26em] text-white/80 backdrop-blur-md">
            Portfolio-ready sandbox
          </div>
          <div className="max-w-xl space-y-5">
            <h2 className="text-4xl font-semibold tracking-[-0.05em] text-white">
              Safe commerce flows for demos, QA, and portfolio walkthroughs.
            </h2>
            <p className="max-w-lg text-base leading-7 text-white/74">
              Sign in to explore cart, checkout, orders, wishlist, and admin management with server-controlled sandbox logic.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AuthFormLayout;
