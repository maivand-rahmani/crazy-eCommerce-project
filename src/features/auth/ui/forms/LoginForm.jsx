"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

import { sanitizeRedirectPath } from "@/shared/lib";

const LoginForm = ({ redirectTo = "/" }) => {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const safeRedirectTo = sanitizeRedirectPath(redirectTo);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    const res = await signIn("credentials", {
      redirect: false,
      callbackUrl: safeRedirectTo,
      email: data.email,
      password: data.password,
    });

    if (res?.status === 401 || res?.error) {
      setError("root", { message: t("errors.invalid") });
      toast.error(t("errors.invalid"));
      return;
    }

    reset();
    router.replace(safeRedirectTo);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8" noValidate>
      <div className="flex flex-col gap-2 text-text">
        <h1 className="text-2xl font-extrabold">{t("title")}</h1>
        <h2 className="text-base text-unactive-text font-light">{t("subtitle")}</h2>
        {errors.root ? (
          <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">
            {errors.root.message}
          </p>
        ) : null}
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-text">{t("email")}</span>
        <input
          {...register("email", {
            required: t("errors.invalid"),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t("errors.invalid"),
            },
          })}
          autoComplete="email"
          className="inputStyle"
          placeholder="name@example.com"
          type="email"
          inputMode="email"
          spellCheck={false}
          id="email"
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email ? <span className="text-danger text-sm">{errors.email.message}</span> : null}
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-text">{t("password")}</span>
        <input
          {...register("password", {
            required: t("errors.invalid"),
            minLength: {
              value: 8,
              message: t("errors.invalid"),
            },
          })}
          autoComplete="current-password"
          className="inputStyle"
          type="password"
          id="password"
          aria-invalid={errors.password ? "true" : "false"}
        />
        {errors.password ? (
          <span className="text-danger text-sm">{errors.password.message}</span>
        ) : null}
      </label>

      <button
        className="rounded-xl bg-button p-3 text-center font-extrabold text-button-text transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Loading..." : t("button")}
      </button>
    </form>
  );
};

export default LoginForm;
