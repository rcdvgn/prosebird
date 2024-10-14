"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { redirect } from "next/navigation";

import { RecentScriptsProvider } from "@/app/contexts/RecentScriptsContext";
import { ScriptEditorProvider } from "@/app/contexts/ScriptEditorContext";
import Sidebar from "@/app/components/Sidebar";

export default function Main({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    redirect("/");
  }

  return (
    <>
      <div id="main" className="flex border-stroke border-[1px] rounded-lg">
        <RecentScriptsProvider>
          <ScriptEditorProvider>
            <Sidebar />
            {children}
          </ScriptEditorProvider>
        </RecentScriptsProvider>
      </div>
    </>
  );
}
