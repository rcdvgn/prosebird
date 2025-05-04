"use client";
import AuthForm from "@/app/_components/AuthForm";
import { useState } from "react";

const SignIn: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  return <AuthForm flow="signin" error={error} setError={setError} />;
};

export default SignIn;
