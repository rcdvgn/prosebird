// tiptap.tsx
"use client";

import { EditorContent } from "@tiptap/react";
import { useScriptEditor } from "@/app/_contexts/ScriptEditorContext";
const Tiptap = () => {
  const { editor } = useScriptEditor();

  if (!editor) return null;

  return (
    <div className="tiptap-editor-parent">
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
