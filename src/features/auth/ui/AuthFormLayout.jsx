"use client";
import React, { useState } from "react";
import LoginForm from "./forms/LoginForm";
import RegisterForm from "./forms/RegisterForm";
import OAuthForm from "./OAuthForm/OAuthForm";

const AuthFormLayout = () => {
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

        <span className="text-unactive-text">Or continue with</span>
        <div>
          <OAuthForm />
        </div>
        <div className="text-unactive-text">
          <span>
            {form === "login"
              ? "Don't have an account?"
              : "You have an account?"}
          </span>
          <button
            onClick={() => setForm(form === "login" ? "register" : "login")}
            className="underline hover:text-text"
          >
            {form === "login" ? "Register" : "Login"}
          </button>
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
