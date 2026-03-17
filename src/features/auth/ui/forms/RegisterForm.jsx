"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

import { register as registerUser } from "@/features/auth/model/register";
import { sanitizeRedirectPath } from "@/shared/lib";

const LETTERS_REGEX = /^[\p{L}\p{M}' -]+$/u;

const RegisterForm = ({ redirectTo = "/" }) => {
  const t = useTranslations("auth.register");
  const tLogin = useTranslations("auth.login");
  const router = useRouter();
  const safeRedirectTo = sanitizeRedirectPath(redirectTo);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm({ mode: "onBlur" });

  const handleRegister = async ({ email, password, firstname, lastname }) => {
    setServerError("");

    try {
      const response = await registerUser({ email, password, firstname, lastname });

      if (response?.error) {
        setServerError(response.error);
        toast.error(response.error);
        return;
      }

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: safeRedirectTo,
      });

      if (res?.error) {
        toast.error(tLogin("errors.invalid"));
        return;
      }

      reset();
      router.replace(safeRedirectTo);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("errors.somethingWrong");
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleRegister)} className="flex flex-col gap-8" noValidate>
      <div className="flex flex-col gap-2 text-text">
        <h1 className="text-2xl font-extrabold">{t("title")}</h1>
        <h2 className="text-base text-unactive-text font-light">{t("subtitle")}</h2>
        {serverError ? (
          <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">
            {serverError}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-text">
            {t("firstName")} <span className="text-danger">*</span>
          </span>
          <input
            {...register("firstname", {
              required: t("errors.firstNameRequired"),
              minLength: {
                value: 2,
                message: t("errors.firstNameRequired"),
              },
              maxLength: {
                value: 40,
                message: t("errors.firstNameLetters"),
              },
              pattern: {
                value: LETTERS_REGEX,
                message: t("errors.firstNameLetters"),
              },
            })}
            autoComplete="given-name"
            className="inputStyle"
            placeholder="David"
            type="text"
            id="firstname"
            aria-invalid={errors.firstname ? "true" : "false"}
          />
          {errors.firstname ? (
            <span className="text-danger text-sm">{errors.firstname.message}</span>
          ) : null}
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-text">
            {t("lastName")} <span className="text-danger">*</span>
          </span>
          <input
            {...register("lastname", {
              required: t("errors.lastNameRequired"),
              minLength: {
                value: 2,
                message: t("errors.lastNameRequired"),
              },
              maxLength: {
                value: 40,
                message: t("errors.lastNameLetters"),
              },
              pattern: {
                value: LETTERS_REGEX,
                message: t("errors.lastNameLetters"),
              },
            })}
            autoComplete="family-name"
            className="inputStyle"
            placeholder="Smith"
            type="text"
            id="lastname"
            aria-invalid={errors.lastname ? "true" : "false"}
          />
          {errors.lastname ? (
            <span className="text-danger text-sm">{errors.lastname.message}</span>
          ) : null}
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-text">
          Email <span className="text-danger">*</span>
        </span>
        <input
          {...register("email", {
            required: tLogin("errors.invalid"),
            pattern: {
              value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
              message: tLogin("errors.invalid"),
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
        <span className="text-text">
          {t("password")} <span className="text-danger">*</span>
        </span>
        <input
          {...register("password", {
            required: true,
            minLength: {
              value: 8,
              message: t("errors.passwordLength"),
            },
            maxLength: {
              value: 72,
              message: t("errors.passwordLength"),
            },
          })}
          autoComplete="new-password"
          className="inputStyle"
          type="password"
          id="password"
          aria-invalid={errors.password ? "true" : "false"}
        />
        {errors.password ? (
          <span className="text-danger text-sm">{errors.password.message}</span>
        ) : null}
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-text">
          {t("confirmPassword")} <span className="text-danger">*</span>
        </span>
        <input
          {...register("password-confirm", {
            required: true,
            validate: (value) =>
              value === getValues("password") || t("errors.passwordMatch"),
          })}
          autoComplete="new-password"
          className="inputStyle"
          type="password"
          id="password-confirm"
          aria-invalid={errors["password-confirm"] ? "true" : "false"}
        />
        {errors["password-confirm"] ? (
          <span className="text-danger text-sm">
            {errors["password-confirm"].message}
          </span>
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

export default RegisterForm;
