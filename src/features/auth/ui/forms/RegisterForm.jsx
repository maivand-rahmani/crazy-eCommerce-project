"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { register as registerUser } from "@/features/auth/model/register";
import { signIn } from "next-auth/react";
import { useRouter} from "next/navigation";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

const RegisterForm = () => {
  const t = useTranslations("auth.register");
  let router = useRouter();
  let [loading, setLoading] = useState(false);
  let {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({ mode: "onChange" });

  const handleRegister = async ({ email, password, firstname, lastname }) => {
    setLoading(true);
    try {
      const user = await registerUser({ email, password, firstname, lastname });

      if (user) {
        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
          callbackUrl: "/",
        });

        if (res?.error) {
          toast.error(t("errors.somethingWrong"));
        } else {
          reset();
          router.replace("/");
        }
      }
    } catch (error) {
      toast.error(t("errors.somethingWrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleRegister)} className="flex flex-col gap-10">
      <div className="flex flex-col center gap-2 text-text">
        <h1 className="text-2xl font-extrabold">{t("title")}</h1>
        <h2 className="text-lg text-unactive-text font-extralight">
          {t("subtitle")}
        </h2>
      </div>

      <div className="flex flex-row gap-5">
        <label className="flex flex-col gap-2">
          <span className="text-text">
            {t("firstName")} <span className="text-danger">*</span>
          </span>
          <input
            {...register("firstname", {
              required: true,
              minLength: {
                value: 2,
                message: t("errors.firstNameRequired"),
              },
              pattern: {
                value: /^[A-Za-z]+$/,
                message: t("errors.firstNameLetters"),
              },
              maxLength: {
                value: 20,
                message: "First name must be less than 20 characters",
              },
            })}
            className="inputStyle"
            placeholder="David"
            type="text"
            name="firstname"
            id="firstname"
          />
          {errors.firstname && (
            <span className="text-danger">{errors.firstname.message}</span>
          )}
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-text">
            {t("lastName")} <span className="text-danger">*</span>
          </span>
          <input
            {...register("lastname", {
              required: true,
              maxLength: {
                value: 20,
                message: "Last name must be less than 20 characters",
              },
              minLength: {
                value: 2,
                message: t("errors.lastNameRequired"),
              },
              pattern: {
                value: /^[A-Za-z]+$/,
                message: t("errors.lastNameLetters"),
              },
            })}
            className="inputStyle"
            placeholder="Smith"
            type="text"
            name="lastname"
            id="lastname"
          />
          {errors.lastname && (
            <span className="text-danger">{errors.lastname.message}</span>
          )}
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <span className="text-text">
          Email <span className="text-danger">*</span>
        </span>
        <input
          {...register("email", {
            required: true,
            pattern: {
              value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
              message: "Invalid email",
            },
          })}
          className="inputStyle"
          placeholder="name@example.com"
          type="email"
          name="email"
          id="email"
        />
        {errors.email && (
          <span className="text-danger">{errors.email.message}</span>
        )}
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
              value: 20,
              message: "Password must be less than 20 characters",
            },
          })}
          className="inputStyle"
          type="password"
          name="password"
          id="password"
        />
        {errors.password && (
          <span className="text-danger">{errors.password.message}</span>
        )}
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
          className="inputStyle"
          type="password"
          name="password-confirm"
          id="password-confirm"
        />
        {errors["password-confirm"] && (
          <span className="text-danger">
            {errors["password-confirm"].message}
          </span>
        )}
      </label>
      <button
        className="p-3 rounded-xl w-full text-center bg-button text-button-text font-extrabold"
        type="submit"
      >
        {t("button")}
      </button>
    </form>
  );
};

export default RegisterForm;
