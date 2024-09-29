"use client";

import ScriptEditor from "./components/ScriptEditor";
import { ScriptEditorProvider } from "@/app/contexts/ScriptEditorContext";

export default function Main() {
  return (
    <>
      <div className="border-r-[1px] border-stroke w-[300px]"></div>
      <ScriptEditorProvider>
        <ScriptEditor />
      </ScriptEditorProvider>
    </>
  );
}
