"use client";
import React, { useState } from "react";
import * as EmailValidator from "email-validator";
import { BorderSpinner } from "../_assets/icons";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitForm = (e: any) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const isValidEmail = EmailValidator.validate(trimmedEmail);
    console.log(isValidEmail);
    // setLoading(true);
    // const isNewEmail = // check if email exists in the db
  };

  return (
    <form
      onSubmit={submitForm}
      className="relative h-screen w-full flex flex-col"
    >
      <div className="pointer-events-none z-10 w-full flex max-sm:justify-center items-center gap-3 px-[4vw] py-6">
        <img src="/logos/logo64.png" className="block h-[30px]"></img>
        <span className="font-extrabold text-text-primary text-[18px]">
          MeanIt
        </span>
      </div>
      <div className="z-10 w-full grow flex flex-col items-center justify-start max-sm:pt-[3vh] max-md:pt-[6vh] py-[12vh] px-12">
        <div className="mb-8 text-center max-w-[750px] font-bold text-[40px] sm:text-[48px] text-text-primary">
          Delivering killer presentations has never been so easy
        </div>

        <div className="max-sm:mb-10 max-md:mb-16 mb-20 leading-9 text-center w-full max-sm:text-base max-w-[600px] font-medium text-[20px] text-text-secondary">
          MeanIt is a powerful script engine that helps you perform your very
          best everytime you step on the virtual stage.
        </div>

        <div className="mb-6 text-center w-full font-medium text-base text-[20px] text-text-primary">
          Join the waiting list and be notified as soon as we launch!
        </div>

        {!success && (
          <div className="max-[500px]:w-full">
            <div className="w-full bg-[#111318] border-0 ring-[#222222] rounded-[10px] flex items-center gap-2 pr-2 ring-1 focus-within:ring-brand/50">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="max-sm:text-sm min-w-0 px-4 font-medium text-text-primary placeholder:text-text-primary/30 text-sm bg-transparent border-none outline-none max-[500px]:grow min-[500px]:w-[300px] h-[52px]"
                type="text"
                placeholder="Your best email"
              />
              <div className="flex h-[26px] mr-2">
                <div
                  style={{
                    backgroundImage: `url("/pfps/profile1.png")`,
                  }}
                  className="-ml-[4px] h-[full] aspect-square rounded-full box-content ring-2 ring-[#111318] bg-cover bg-center flex-shrink-0"
                ></div>
                <div
                  style={{
                    backgroundImage: `url("/pfps/profile2.png")`,
                  }}
                  className="-ml-[4px] h-[full] aspect-square rounded-full box-content ring-2 ring-[#111318] bg-cover bg-center flex-shrink-0"
                ></div>
              </div>
              <button
                type="submit"
                className="relative bg-brand px-[20px] py-[10px] rounded-[8px] text-text-primary font-semibold text-sm hover:opacity-80 max-[500px]:hidden shrink-0"
              >
                <span className={loading ? "invisible" : "visible"}>
                  Sign Up
                </span>
                <BorderSpinner
                  className={`absolute m-auto left-0 top-0 bottom-0 right-0 text-text-primary animate-spin ${
                    loading ? "visible" : "invisible"
                  }`}
                />
              </button>
            </div>
            {error !== "" && (
              <div className="w-full text-text-danger text-xs font-semibold py-3">
                Email is already registered
              </div>
            )}
            <button
              disabled={loading ? true : false}
              type="submit"
              className="mt-4 bg-brand px-[20px] py-[10px] rounded-[8px] text-text-primary font-semibold text-sm hover:opacity-80 min-[500px]:hidden w-full flex justify-center"
            >
              {loading ? (
                <BorderSpinner className="text-text-primary animate-spin" />
              ) : (
                <span>Sign Up</span>
              )}
            </button>
          </div>
        )}
      </div>
      <div className="z-0 fixed left-0 top-0 h-screen w-full overflow-hidden pointer-events-none">
        <div className="h-full w-full"></div>
        <div className="w-full h-[180px] bg-brand/60 blur-[200px]"></div>
      </div>
    </form>
  );
}
