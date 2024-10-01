// AuthContext.tsx
"use client";

import React, { createContext, useContext } from "react";

// Define the User interface
interface User {
  id: any;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

// Create the AuthContext
const AuthContext = createContext<{ user: User | null } | null>(null);

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context; // Return the whole context (which includes the user)
};

// Create the AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const user: User = {
    id: "fxkFMi4yUTgT9HgeG9YF",
    firstName: "Ricardo",
    lastName: "Vigliano",
    email: "ricardorpvigliano@gmail.com",
    createdAt: "idk",
  };

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
    // Now `value` is an object with a `user` property
  );
};

// Export the AuthContext
export default AuthContext;
