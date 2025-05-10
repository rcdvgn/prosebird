"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/app/_contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";

import { ScriptEditorProvider } from "@/app/_contexts/ScriptEditorContext";
import Sidebar from "@/app/_components/Sidebar";
import { RealtimeDataProvider } from "@/app/_contexts/RealtimeDataContext";
import { useModal } from "@/app/_contexts/ModalContext";
import Onboarding from "@/app/_components/modals/Onboarding";

const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { openModal, currentModal, closeModal } = useModal();
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();

  const [letUserIn, setLetUserIn] = useState(false);

  // const [isProcessing, setIsProcessing] = useState(true);

  const fileId = params?.fileId || null;

  useEffect(() => {
    if (user) {
      console.log(user);
      setLetUserIn(true);

      if (!user.displayName) {
        openModal({
          content: <Onboarding />,
          name: "onboarding",
          options: { closable: false },
        });
      } else {
        if (currentModal && currentModal?.name === "onboarding") {
          closeModal();
        }
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
