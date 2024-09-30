"use client";

import ScriptEditor from "./components/ScriptEditor";
import { ScriptEditorProvider } from "@/app/contexts/ScriptEditorContext";

import Sidebar from "./components/Sidebar";

export default function Main() {
  return (
    <>
      <ScriptEditorProvider>
        <Sidebar />
        <ScriptEditor />
      </ScriptEditorProvider>
    </>
  );
}
