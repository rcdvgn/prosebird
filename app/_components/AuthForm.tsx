"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  HidePasswordIcon,
  LoadingIcon,
  ShowPasswordIcon,
} from "@/app/_assets/icons";
import { useAuth } from "../_contexts/AuthContext";
import LegalNotice from "./LegalNotice";
import AuthContainer from "./containers/AuthContainer";
import isEmail from "validator/lib/isEmail";

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

export default function AuthForm({
  flow,
  setFinalEmail = null,
  error,
  setError,
}: any) {
  const { login, googleLogin } = useAuth();

  const [email, setEmail] = useState<any>("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<any>(false);
  const [loading, setLoading] = useState<boolean>(false);

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
    setLoading(true);
    setError(null);

    try {
      const trimmedEmail = email.trim();
      if (!isEmail(trimmedEmail)) {
        setError("Invalid email format. Please enter a valid email.");
        setLoading(false);
        return;
      }

      setFinalEmail(email);

      setLoading(false);
    } catch (error) {
      setError("Failed to sign up. Please try again.");
      console.error("SignUp error:", error);
    }
  };

  return (
    <AuthContainer
      error={error}
      title={flow === "signin" ? "Welcome back" : "Create account"}
      description={<AuthFlow flow={flow} />}
    >
      <form
        className="flex flex-col gap-6 px-6 sm:px-8 grow w-full"
        onSubmit={flow === "signin" ? handleSignIn : handleSignUp}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-[10px] items-start">
            <label className="text-primary text-sm font-semibold px-3.5">
              Email
            </label>
            <input
              type="text"
              value={email}
              placeholder="Your email address"
              className="input-default w-full"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {flow === "signin" && (
            <div className="flex flex-col items-start gap-[10px]">
              <label className="text-primary text-sm font-semibold px-3.5">
                Password
              </label>

              <div className="input-default flex items-center w-full !p-0">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  placeholder="Your password"
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

              <span className="text-sm text-secondary font-medium cursor-pointer hover:text-primary">
                Forgot your password?
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <button className="btn-1-lg w-full" type="submit">
            {loading ? (
              <span className="w-full h-full flex items-center justify-center">
                <LoadingIcon className="text-primary animate-spin h-4" />
              </span>
            ) : flow === "signin" ? (
              "Sign In"
            ) : (
              "Continue"
            )}
          </button>

          <div className="flex items-center">
            <div className="bg-border h-[1px] w-full"></div>
            <span className="text-secondary font-medium text-sm px-3 shrink-0">
              or continue with
            </span>
            <div className="bg-border h-[1px] w-full"></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={googleLogin}
              className="btn-2-lg w-full items-center flex justify-center gap-2.5"
            >
              <img
                src="/static/logos/google_48.png"
                alt=""
                className="h-4 aspect-square"
              />
              <span className="">Google</span>
            </button>

            <button className="btn-2-lg w-full items-center flex justify-center gap-2.5">
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
    </AuthContainer>
  );
}
