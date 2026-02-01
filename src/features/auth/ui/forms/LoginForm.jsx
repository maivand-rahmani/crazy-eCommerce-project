"use client";
import React from "react";
import { useForm } from "react-hook-form";

const LoginForm = () => {
  let {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setFocus,
    watch,
    getValues,
  } = useForm();


  return (
    <form className="flex flex-col gap-10">
      <div className="flex flex-col center gap-2 text-text">
        <h1 className="text-2xl font-extrabold">Login to your account</h1>
        <h2 className="text-lg text-unactive-text font-extralight">Enter your email below to login to your account</h2>
      </div>
      <label className="flex flex-col gap-2">
        <span className="text-text">Email</span>
        <input className="inputStyle" placeholder="name@example.com" type="email" name="email" id="email" />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-text">Password</span>
        <input className="inputStyle" type="password" name="password" id="password" />
      </label>
      <button className="p-3 rounded-xl w-full text-center text-white dark:text-shadow-zinc-950 bg-black dark:bg-white-500" type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
