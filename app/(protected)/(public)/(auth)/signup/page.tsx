"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/_contexts/AuthContext";

const SignUp: React.FC = () => {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state

    try {
      await signup(email, password);
      // Redirect or perform any action upon successful signup
    } catch (error) {
      setError("Failed to sign up. Please try again.");
      console.error("SignUp error:", error);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            className="bg-transparent ring-1 ring-foreground-primary"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            className="bg-transparent ring-1 ring-foreground-primary"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
