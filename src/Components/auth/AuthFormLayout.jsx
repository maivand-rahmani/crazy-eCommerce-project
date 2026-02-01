"use client";
import React from 'react'
import LoginForm from './forms/LoginForm'
import RegisterForm from './forms/RegisterForm'
import OAuthForm from "./OAuthForm/OAuthForm"


const AuthFormLayout = () => {
  return (
    <main className='bg-bg h-screen grid grid-cols-2'>
        <div className='px-20 flex flex-col center gap-2'>
            <LoginForm />
            <span className='text-unactive-text'>Or continue with</span>
            <div>
              <OAuthForm />
            </div>
            <div className='text-unactive-text'>
              <span>Dont have an account?</span>
              <button className=' underline hover:text-text'> Sign up</button>
            </div>
        </div>
        <div></div>
    </main>
  )
}

export default AuthFormLayout