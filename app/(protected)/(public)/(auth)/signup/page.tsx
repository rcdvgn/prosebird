"use client";

import AuthForm from "@/app/_components/AuthForm";
import VerifyEmail from "@/app/_components/VerifyEmail";
import { useEffect, useState } from "react";

const SignUp: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [finalEmail, setFinalEmail] = useState<any>("");
  const [isEmailValidated, setIsEmailValidated] = useState<any>(false);

  const sendVerificationCode = async (email: string) => {
    try {
      const res = await fetch("/api/auth/email-verification/create-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setIsEmailValidated(true);
    } catch (err) {
      console.error("Failed to send verification email:", err);
      // Handle error in UI
    }
  };

  const handleFinalEmail = () => {
    sendVerificationCode(finalEmail);
  };

  useEffect(() => {
    if (!finalEmail.length) return;
    handleFinalEmail();
  }, [finalEmail]);

  return isEmailValidated ? (
    <VerifyEmail email={finalEmail} />
  ) : (
    <AuthForm
      flow="signup"
      setFinalEmail={setFinalEmail}
      error={error}
      setError={setError}
    />
  );
};

export default SignUp;
