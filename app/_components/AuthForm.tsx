"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { HidePasswordIcon, ShowPasswordIcon } from "@/app/_assets/icons";
import { useAuth } from "../_contexts/AuthContext";
import LegalNotice from "./LegalNotice";

function AuthFlow({ flow }: any) {
  const router = useRouter();

  return (
    <div className="text-sm font-semibold">
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
    <div className="max-sm:h-full sm:max-w-[465px] min-h-[620px] sm:rounded-2xl z-10 bg-background border-stroke border-[1px] pb-10 w-full mx-auto overflow-hidden flex flex-col items-center justify-center">
      {error && (
        <div className="text-center w-full py-1.5 bg-red-800">
          <span className="text-primary text-[13px] font-medium">{error}</span>
        </div>
      )}

      <div className="mx-6 sm:mx-8 my-8 flex flex-col gap-6 items-center">
        <img
          className="h-9 !aspect-square"
          src="https://utfs.io/a/dv6kwxfdfm/X7kJqL6j4LDUlNtWPnomHUs49zRpMfonbdO3FGlh8Be6YKQ0"
          alt="Logo"
        />
        <div className="text-center">
          <span className="block font-bold text-primary text-3xl mb-2">
            {flow === "signin" ? "Welcome back" : "Create account"}
          </span>
          <AuthFlow flow={flow} />
        </div>
      </div>

      <form
        className="flex flex-col gap-6 mx-6 sm:mx-8 grow"
        onSubmit={flow === "signin" ? handleSignIn : handleSignUp}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-[10px]">
            <label className="text-primary text-sm font-semibold px-3.5">
              Email
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

          {flow === "signin" && (
            <div className="flex flex-col gap-[10px]">
              <label className="text-primary text-sm font-semibold px-3.5">
                Password
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
          )}
        </div>

        <div className="flex flex-col gap-4">
          <button className="btn-1-lg w-full" type="submit">
            {flow === "signin" ? "Sign In" : "Sign Up"}
          </button>

          <div className="flex items-center">
            <div className="bg-border h-[1px] w-full"></div>
            <span className="text-secondary font-medium text-sm px-3 shrink-0">
              or continue with
            </span>
            <div className="bg-border h-[1px] w-full"></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5">
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
        </div>
        <LegalNotice />
      </form>
    </div>
  );
}
