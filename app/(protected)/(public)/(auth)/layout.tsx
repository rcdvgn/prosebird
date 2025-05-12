"use client";

import GradientBackground from "@/app/_components/wrappers/GradientBackground";
import React, { ReactNode } from "react";

const AuthLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-screen grid place-items-center bg-middleground">
      {/* <GradientBackground /> */}
      {children}
    </div>
  );
};

export default AuthLayout;
