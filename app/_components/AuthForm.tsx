"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { HidePasswordIcon, ShowPasswordIcon } from "@/app/_assets/icons";
import { useAuth } from "../_contexts/AuthContext";

function AuthFlow({ flow }: any) {
  const router = useRouter();

  return (
    <div className="text-sm w-full text-center font-semibold my-4">
      <span className="text-secondary mr-1 pointer-events-none">
        {flow === "signup"
          ? "Already have an account?"
          : "Don't have an account?"}
      </span>
      <span
        onClick={() => {
          router.push("/" + (flow === "signup" ? "signin" : "signup"));
        }}
        className="text-primary cursor-pointer hover:underline"
      >
        {flow === "signup" ? "Sign In" : "Sign Up"}
      </span>
    </div>
  );
}

export default function AuthForm({ flow }: any) {
  const { login, signup, googleLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<any>(false);

  const [error, setError] = useState<string | null>(null);

  // const alternateFlow = flow === "signin" ? "signup" : "signin";

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state

    try {
      await login(email, password);
      // Redirect or perform any action upon successful login
    } catch (error) {
      setError("Failed to sign in. Please check your credentials.");
      console.error("SignIn error:", error);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signup(email, password);
    } catch (error) {
      setError("Failed to sign up. Please try again.");
      console.error("SignUp error:", error);
    }
  };
  return (
    <div className="w-[400px] h-full flex flex-col justify-between">
      <div className="invisible pointer-events-none">
        <AuthFlow flow={flow} />
      </div>

      <div className="-mt-[10%]">
        <div className="w-full text-center mb-10">
          <span className="block font-bold text-primary text-3xl mb-2">
            {flow === "signin" ? "Welcome back!" : "Create account"}
          </span>
          <span className="block font-semibold text-secondary text-sm">
            {`Use your preferable sign${
              flow === "signin" ? "in" : "up"
            } method`}
          </span>
        </div>

        <form
          className="flex flex-col gap-6"
          onSubmit={flow === "signin" ? handleSignIn : handleSignUp}
        >
          <div className="flex flex-col gap-[10px]">
            <label className="text-primary text-sm font-semibold">
              Email{flow === "signin" ? "" : "*"}
            </label>
            <input
              type="text"
              value={email}
              placeholder="Enter your email address"
              className="input-default w-full"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-[10px]">
            <label className="text-primary text-sm font-semibold">
              Password{flow === "signin" ? "" : "*"}
            </label>

            <div className="input-default flex items-center w-full !p-0">
              <input
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                placeholder={
                  flow === "signin"
                    ? "Enter your password"
                    : "Create a password"
                }
                className="input-default grow !border-0 !outline-0"
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <span
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="button-icon mr-2"
              >
                {isPasswordVisible ? (
                  <ShowPasswordIcon className="" />
                ) : (
                  <HidePasswordIcon className="" />
                )}
              </span>
            </div>
          </div>

          <button className="btn-1-lg w-full" type="submit">
            {flow === "signin" ? "Sign In" : "Sign Up"}
          </button>

          <div className="flex items-center">
            <div className="bg-border h-[1px] w-full"></div>
            <span className="text-secondary font-medium text-sm px-3 shrink-0">
              or {flow} with
            </span>
            <div className="bg-border h-[1px] w-full"></div>
          </div>

          <div className="flex gap-3.5">
            <button
              onClick={googleLogin}
              className="button-secondary w-full items-center flex justify-center gap-2.5"
            >
              <img
                src="/static/logos/google_48.png"
                alt=""
                className="h-4 aspect-square"
              />
              <span className="">Google</span>
            </button>

            <button className="button-secondary w-full items-center flex justify-center gap-2.5">
              <img
                src="/static/logos/apple_48.png"
                alt=""
                className="h-4 aspect-square"
              />
              <span className="">Apple</span>
            </button>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>

      <AuthFlow flow={flow} />
    </div>
  );
}
