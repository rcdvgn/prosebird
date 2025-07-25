"use client";

import { HidePasswordIcon, ShowPasswordIcon } from "@/app/_assets/icons";
import AuthContainer from "@/app/_components/containers/AuthContainer";
import React, { useRef, useState, useEffect } from "react";
import { passwordStrength } from "check-password-strength";
import { redirect } from "next/navigation";
import { useAuth } from "@/app/_contexts/AuthContext";

export default function CreatePassword({
  params,
}: {
  params: { token: string };
}) {
  const token = params.token;

  if (!token) {
    redirect("/");
  }

  const { login } = useAuth();

  const [error, setError] = useState<any>("");
  const [password, setPassword] = useState<any>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<any>(false);
  const [strength, setStrength] = useState<any>("Too weak");

  const colorMap: any = {
    0: "bg-red-600",
    1: "bg-orange-600",
    2: "bg-yellow-600",
    3: "bg-green-600",
  };

  const createAccount = async () => {
    try {
      // console.log(token, password);
      // return;
      const res = await fetch("/api/auth/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      await login(data.email, password);
    } catch (err) {
      console.error("Account creation failed:", err);
      // Show toast or set error state
    }
  };

  const handleSubmit = async () => {
    createAccount();
  };

  useEffect(() => {
    setStrength(passwordStrength(password));
  }, [password]);

  return (
    <AuthContainer
      error={error}
      title="Create a password"
      description="Secure your account with a password you'll remember."
    >
      <form
        className="flex flex-col items-center gap-6 px-6 sm:px-8 grow w-full"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="flex flex-col gap-4 w-full">
          <div className="input-default flex items-center w-full !p-0">
            <input
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              placeholder="New password"
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

          <div className="">
            <div className="flex gap-1 mb-4">
              {Object.entries(colorMap).map(([index, color]: any) => {
                return (
                  <div
                    key={index}
                    className={`grow h-1 rounded-full ${
                      strength.id >= index ? color : "bg-battleground"
                    }`}
                  ></div>
                );
              })}
            </div>
            <div className="inline-block text-sm font-medium">
              <span className="text-secondary mr-1">Password strength:</span>
              <span className="text-primary">{strength.value}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2 w-full">
          <div className="inline-block text-sm font-medium my-3 text-center">
            <span className="text-secondary mr-1">Signin up as</span>
            <span className="text-primary">gabe@prosebird.com</span>
          </div>

          <button className="btn-2-lg w-full">Use a different email</button>

          <button
            disabled={strength.id < 1}
            className="btn-1-lg w-full"
            type="submit"
          >
            Sign Up
          </button>
        </div>
      </form>
    </AuthContainer>
  );
}
