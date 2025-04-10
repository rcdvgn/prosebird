"use client";
import {
  CheckIcon,
  CircleSpinnerIcon,
  EmailIcon,
} from "@/app/_assets/landingIcons";
import isEmail from "validator/lib/isEmail";
import { useState, useEffect } from "react";

// Define a type for the reCAPTCHA window object
declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoad: () => void;
  }
}

export default function Cta({ success, setSuccess, loading, setLoading }: any) {
  const [isFocused, setIsFocused] = useState<any>(false);
  const [email, setEmail] = useState<any>("");
  const [error, setError] = useState<any>("");
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  // Load reCAPTCHA script
  useEffect(() => {
    // Only load the script once
    if (document.querySelector('script[src*="recaptcha"]')) {
      setRecaptchaLoaded(true);
      return;
    }

    // Set up callback for when reCAPTCHA loads
    window.onRecaptchaLoad = () => {
      setRecaptchaLoaded(true);
    };

    // Add reCAPTCHA script
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}&onload=onRecaptchaLoad`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      // Clean up if component unmounts
      window.onRecaptchaLoad = () => {};
    };
  }, []);

  const executeRecaptcha = async () => {
    if (!window.grecaptcha) {
      console.error("reCAPTCHA not loaded");
      return null;
    }

    try {
      const token = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        { action: "submit" }
      );
      return token;
    } catch (error) {
      console.error("reCAPTCHA execution error:", error);
      return null;
    }
  };

  const submitForm = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const trimmedEmail = email.trim();
    if (!isEmail(trimmedEmail)) {
      setError("Invalid email format. Please enter a valid email.");
      setLoading(false);
      return;
    }

    // Execute reCAPTCHA verification
    const recaptchaToken = await executeRecaptcha();
    if (!recaptchaToken) {
      setError("Verification failed. Please try again later.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/landing/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          recaptchaToken, // Send token for verification on server
        }),
      });

      if (response.status === 400) {
        setError("Invalid email format. Please enter a valid email.");
        setLoading(false);
        return;
      }

      if (response.status === 403) {
        setError("Verification failed. Please try again.");
        setLoading(false);
        return;
      }

      if (response.status === 500) {
        setError("An error occurred. Please try again later.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (response.status === 201) {
        setSuccess("You have successfully applied. Thank you!");
        setError("");
      } else if (data.isNewEmail === false) {
        setSuccess("You have successfully applied. Thank you!");
        setError("");
      } else {
        setError("Failed to process your request. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting waitlist email:", error);
      setError("An unexpected error occurred. Please try again.");
    }

    setLoading(false);
  };

  const onFocus = () => setIsFocused(true);
  const onBlur = () => setIsFocused(false);

  return (
    <div className="mx-auto h-[122px] w-[450px] my-8">
      <form
        onSubmit={submitForm}
        className="relative flex flex-col items-center justify-center w-full"
      >
        {!success.length ? (
          <>
            <div
              className={`transition-all duration-300 ease-in-out flex items-center h-[50px] rounded-[14px] bg-background/50 border-[1px] focus-within:bg-background/100 focus-within:border-border border-stroke pr-2 ${
                isFocused || email.length
                  ? "w-full bg-background/100"
                  : "w-[350px]"
              }`}
            >
              <span className="w-[50px] h-full grid place-items-center">
                <EmailIcon className="text-placeholder w-5 translate-x-1" />
              </span>
              <input
                value={email}
                onFocus={onFocus}
                onBlur={onBlur}
                type="text"
                className="grow h-full placeholder:text-placeholder bg-transparent border-none outline-none pr-2 text-primary font-semibold text-[15px]"
                placeholder="Your email"
                onChange={(e: any) => setEmail(e.target.value)}
              />
              <button
                disabled={loading ? true : false}
                type="submit"
                className="rounded-[10px] bg-brand w-[65px] h-[34px] text-primary font-bold text-[13px] shrink-0"
              >
                {loading ? (
                  <span className="w-full h-full flex items-center justify-center">
                    <CircleSpinnerIcon className="text-primary animate-spin h-4" />
                  </span>
                ) : (
                  <span>Apply</span>
                )}
              </button>
            </div>
            <p
              className={`my-4 leading-5 font-medium text-[13px] text-secondary text-center px-2 ${
                isFocused || email.length ? "opacity-100" : "opacity-0"
              }`}
            >
              By applying, you agree to be notified of product launches and
              updates by email, which you can unsubscribe from at any time.
            </p>
            {error.length > 0 && (
              <span className="absolute bottom-full left-0 w-full text-center pb-1 text-red-700 font-semibold text-[13px]">
                {error}
              </span>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2 justify-center w-full">
            <span className="rounded-full bg-brand grid place-items-center h-4 aspect-square overflow-hidden">
              <CheckIcon className="h-[7px] text-primary translate-x-[1px] translate-y-[1px]" />
            </span>
            <span className="text-primary font-semibold text-sm">
              {success}
            </span>
          </div>
        )}
      </form>
    </div>
  );
}
