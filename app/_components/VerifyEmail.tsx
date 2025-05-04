"use client";

import AuthContainer from "@/app/_components/containers/AuthContainer";
import { useRouter } from "next/navigation";
import React, { useRef, useState, useEffect } from "react";

export default function VerifyEmail({ email }: any) {
  const router = useRouter();

  const [error, setError] = useState<any>("");
  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const [resendTimeout, setResendTimeout] = useState<number>(30);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const verifyEmailCode = async (code: any) => {
    if (!/^[0-9]{4}$/.test(code)) {
      console.error("Code must be exactly 4 digits");
      return;
    }

    try {
      const res = await fetch("/api/auth/email-verification/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid verification code");
      }

      if (data.redirectUrl) {
        router.push(data.redirectUrl);
      }
    } catch (err) {
      console.error("Verification failed:", err);
      // Optionally show a toast or error message in your UI
    }
  };

  useEffect(() => {
    if (resendTimeout === 0) return;
    const interval = setInterval(() => {
      setResendTimeout((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimeout]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Only allow single digits

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (index === inputsRef.current.length - 1 && value) {
      handleSubmitCode(newCode);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmitCode = (finalCode?: any) => {
    verifyEmailCode(finalCode.join(""));
    // Add verification logic here
  };

  return (
    <AuthContainer
      error={error}
      title="Verify your email"
      description="Enter the 4-digit code we sent to your email."
    >
      <form
        className="flex flex-col items-center gap-6 px-6 sm:px-8 grow w-full"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitCode();
        }}
      >
        <div className="">
          <div className="flex gap-2 items-center justify-center w-fit mb-4">
            {[0, 1, 2, 3].map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                inputMode="numeric"
                className="!w-16 !h-16 !rounded-[18px] !grid !place-items-center input-default text-center text-2xl"
                value={code[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el: any) => (inputsRef.current[index] = el)}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="inline-block text-sm">
              <span className="text-primary mr-1 font-semibold">
                Didn't receive it?
              </span>
              <span
                className={`text-brand font-bold ${
                  resendTimeout > 0
                    ? "opacity-80 cursor-not-allowed"
                    : "cursor-pointer hover:underline"
                }`}
                onClick={() => {
                  if (resendTimeout === 0) {
                    setResendTimeout(30); // reset timeout
                    // trigger actual resend logic later
                    console.log("Resending code...");
                  }
                }}
              >
                Re-send code
              </span>
            </div>

            <span className="text-sm font-semibold text-secondary">
              {resendTimeout > 0 ? `${resendTimeout}s` : null}
            </span>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2 w-full">
          <div className="inline-block text-sm font-medium my-3 text-center">
            <span className="text-secondary mr-1">Signin up as</span>
            <span className="text-primary">gabe@prosebird.com</span>
          </div>

          <button className="btn-2-lg w-full">Use a different email</button>

          <button className="btn-1-lg w-full" type="submit">
            Verify
          </button>
        </div>
      </form>
    </AuthContainer>
  );
}
