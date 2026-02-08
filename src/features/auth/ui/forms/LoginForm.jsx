"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  let router = useRouter()
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
      email: data.email,
      password: data.password,
    });
    console.log(res)

    if (res?.status === 401) {
       setError("root" , { message: "Email or password is invalid please check!" })
    }

    if (!res?.error) {
      reset();
      router.replace("/");
    }
    
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
      <div className="flex flex-col center gap-2 text-text">
        <h1 className="text-2xl font-extrabold">Login to your account</h1>
        <h2 className="text-lg text-unactive-text font-extralight">
          Enter your email below to login to your account
        </h2>
        {errors.root && (<div className="text-red-500 text-2xl">{errors.root.message}</div>)}
      </div>
      <label className="flex flex-col gap-2">
        <span className="text-text">Email</span>
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
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-text">Password</span>
        <input
          {...register("password", { required: true })}
          className="inputStyle"
          type="password"
          name="password"
          id="password"
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <button
        className="p-3 rounded-xl w-full text-center text-white dark:text-shadow-zinc-950 bg-black dark:bg-white-500"
        type="submit"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
