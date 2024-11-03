"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/_contexts/AuthContext";

const SignIn: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
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
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
