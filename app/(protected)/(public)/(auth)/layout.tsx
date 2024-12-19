"use client";

import React, { ReactNode } from "react";
import SplitView from "@/app/_components/SplitView";

const AuthLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <SplitView options={{ side: "left" }}>{children}</SplitView>;
};

export default AuthLayout;
