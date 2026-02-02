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
  } = useForm({ mode: "onChange" });

  return (
    <form className="flex flex-col gap-10">
      <div className="flex flex-col center gap-2 text-text">
        <h1 className="text-2xl font-extrabold">Create an account</h1>
        <h2 className="text-lg text-unactive-text font-extralight">
          Please enter your details below to create an account
        </h2>
      </div>

      <div className="flex flex-row gap-5" >
        <label className="flex flex-col gap-2">
          <span className="text-text">First Name <span className="text-red-800">*</span></span>
          <input
            {...register("firstname" , {required: true , minLength: {value: 2 , message: "First name must be more than 2 characters"} , pattern: {value: /^[A-Za-z]+$/, message: "First name must be only letters"}, maxLength: {value: 20 , message: "First name must be less than 20 characters"} , pattern: {value: /^[A-Za-z]+$/, message: "First name must be only letters"}})}
            className="inputStyle"
            placeholder="David"
            type="text"
            name="firstname"
            id="firstname"
          />
          {errors.firstname && <span className="text-red-800">{errors.firstname.message}</span>}
        </label>
        <label className="flex flex-col gap-2">
            <span className="text-text">Last Name <span className="text-red-800">*</span></span>
            <input
              {...register("lastname" , {required: true , maxLength: {value: 20 , message: "Last name must be less than 20 characters"} , minLength: {value: 2 , message: "Last name must be more than 2 characters"} , pattern: {value: /^[A-Za-z]+$/, message: "Last name must be only letters"}})}
              className="inputStyle"
              placeholder="Smith"
              type="text"
              name="lastname"
              id="lastname"
            />
            {errors.lastname && <span className="text-red-800">{errors.lastname.message}</span>}
          </label>
      </div>
      <label className="flex flex-col gap-2">
        <span className="text-text">Email <span className="text-red-800">*</span></span>
        <input
          {...register("email" , {required: true , pattern: {value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/ , message: "Invalid email"}})}
          className="inputStyle"
          placeholder="name@example.com"
          type="email"
          name="email"
          id="email"
        />
        {errors.email && <span className="text-red-800">{errors.email.message}</span>}
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-text">Password <span className="text-red-800">*</span></span>
        <input
          {...register("password" , {required: true , minLength: {value: 8 , message: "Password must be more than 8 characters"} , maxLength: {value: 20 , message: "Password must be less than 20 characters"}})}
          className="inputStyle"
          type="password"
          name="password"
          id="password"
        />
        {errors.password && <span className="text-red-800">{errors.password.message}</span>}
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-text">Confirm Password <span className="text-red-800">*</span></span>
        <input
          {...register("password-confirm" , {required: true , validate: (value) => value === getValues("password") || "Passwords do not match"})}
          className="inputStyle"
          type="password"
          name="password-confirm"
          id="password-confirm"
        />
        {errors["password-confirm"] && <span className="text-red-800">{errors["password-confirm"].message}</span>}
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
