"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

const LoginForm = () => {
  const t = useTranslations("auth.login");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  let {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError
  } = useForm();

  const onSubmit = async (data) => {
    let res = await signIn("credentials", {
      redirect: false,
      callbackUrl: redirectTo,
      email: data.email,
      password: data.password,
    });

    if (res?.status === 401 || res?.error) {
       setError("root" , { message: t("errors.invalid") })
       toast.error(t("errors.invalid"));
      }

    if (!res?.error) {
      reset();
      router.replace(redirectTo);
    }
    
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
      <div className="flex flex-col center gap-2 text-text">
        <h1 className="text-2xl font-extrabold">{t("title")}</h1>
        <h2 className="text-lg text-unactive-text font-extralight">
          {t("subtitle")}
        </h2>
        {errors.root && (<div className="text-danger text-2xl">{errors.root.message}</div>)}
      </div>
      <label className="flex flex-col gap-2">
        <span className="text-text">{t("email")}</span>
        <input
          {...register("email", {
            required: true,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
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
        <span className="text-text">{t("password")}</span>
        <input
          {...register("password", { required: true })}
          className="inputStyle"
          type="password"
          name="password"
          id="password"
        />
        {errors.password && (
          <span className="text-danger">{errors.password.message}</span>
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

export default LoginForm;
