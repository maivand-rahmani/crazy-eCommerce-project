"use client";
import React, { useState } from "react";
import LoginForm from "./forms/LoginForm";
import RegisterForm from "./forms/RegisterForm";
import OAuthForm from "./OAuthForm/OAuthForm";
import { useTranslations } from "next-intl";
import { LanguageSwitcher, ThemeSwitcher } from "@/widgets/header/ui";

const AuthFormLayout = () => {
  const t = useTranslations("auth");
  const tLogin = useTranslations("auth.login");
  const tRegister = useTranslations("auth.register");
  let [form, setForm] = useState("login");
  return (
    <main className={`bg-bg h-full grid grid-cols-[1fr_1fr] transition-all`}>
      <div
        className={`px-20 flex flex-col center gap-2  ${form === "login" ? "order-1" : "order-2"} transition-all`}
      >
        <div
          key={form}
          className="transition-opacity duration-500 ease-in-out animate-fadeIn"
        >
          {form === "login" ? <LoginForm /> : <RegisterForm />}
        </div>

        <span className="text-unactive-text">{t("orContinueWith")}</span>
        <div>
          <OAuthForm />
        </div>
        <div className="text-unactive-text">
          <span>
            {form === "login"
              ? tLogin("noAccount")
              : tRegister("hasAccount")}
          </span>
          <button
            onClick={() => setForm(form === "login" ? "register" : "login")}
            className="underline hover:text-text"
          >
            {form === "login" ? tLogin("register") : tRegister("login")}
          </button>
        </div>

        {/* Language and Theme Switchers */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
          <LanguageSwitcher variant="inline" />
          <ThemeSwitcher />
        </div>
      </div>

      <div
        className={`flex flex-col center ${form === "login" ? "order-2" : "order-1"}`}
      >
        <img
          src="https://burst.shopifycdn.com/photos/city-lights-through-rain-window.jpg?width=1000&format=pjpg&exif=0&iptc=0"
          className="transition-opacity duration-900 ease-in-out animate-fadeIn"
          alt=""
        />
      </div>
    </main>
  );
};

export default AuthFormLayout;
