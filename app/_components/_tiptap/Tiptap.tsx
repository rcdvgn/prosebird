// tiptap.tsx
"use client";

import { EditorContent } from "@tiptap/react";
import { useEditorContext } from "@/app/_contexts/EditorContext";

const Tiptap = () => {
  const { editor } = useEditorContext();

  return (
    <div className="tiptap-editor-parent">
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
