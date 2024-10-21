"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_contexts/AuthContext";

const PublicLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/files"); // Redirect to dashboard if user is authenticated
    }
  }, [user, router]);

  // Render children if the user is not authenticated
  return <>{!user ? children : null}</>;
};

export default PublicLayout;
