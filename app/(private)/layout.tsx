"use client";

import React, { ReactNode, useEffect } from "react";
import { useAuth } from "@/app/_contexts/AuthContext";
import { useRouter } from "next/navigation";

import { RecentScriptsProvider } from "@/app/_contexts/RecentScriptsContext";
import { ScriptEditorProvider } from "@/app/_contexts/ScriptEditorContext";
import Sidebar from "@/app/_components/Sidebar";

const AuthenticatedLayout: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/"); // Redirect to home if user is not authenticated
    }
  }, [user, router]);

  // Render children if the user is authenticated
  return (
    <>
      {user ? (
        <div id="main" className="flex border-stroke border-[1px] rounded-lg">
          <RecentScriptsProvider>
            <ScriptEditorProvider>
              <Sidebar />
              {children}
            </ScriptEditorProvider>
          </RecentScriptsProvider>
        </div>
      ) : null}
    </>
  );
};

export default AuthenticatedLayout;
