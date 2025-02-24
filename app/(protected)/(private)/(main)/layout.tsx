"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/app/_contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";

import { ScriptEditorProvider } from "@/app/_contexts/ScriptEditorContext";
import Sidebar from "@/app/_components/Sidebar";
import { RealtimeDataProvider } from "@/app/_contexts/RealtimeDataContext";

const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();

  const [letUserIn, setLetUserIn] = useState(false);

  // const [isProcessing, setIsProcessing] = useState(true);

  const fileId = params?.fileId || null;

  useEffect(() => {
    if (user) {
      if (!user.firstName) {
        router.push("/onboarding");
      } else {
        setLetUserIn(true);
      }
    } else {
      router.push("/");
    }
  }, [user]);

  return (
    <>
      {letUserIn ? (
        <div id="main" className="flex">
          <RealtimeDataProvider>
            <ScriptEditorProvider>
              <Sidebar fileId={fileId} />
              {children}
            </ScriptEditorProvider>
          </RealtimeDataProvider>
        </div>
      ) : null}
    </>
  );
};

export default MainLayout;
