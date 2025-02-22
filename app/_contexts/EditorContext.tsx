"use client";

import React, { createContext, useContext } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { extractChaptersFromDoc } from "../_utils/tiptapHelpers";
import {
  Chapter,
  Title,
  Paragraph,
} from "../_components/_tiptap/extensions/Chapter";
import { ChapterDivider } from "../_components/_tiptap/extensions/ChapterDivider";

const EditorContext = createContext<any>(null);

export const useEditorContext = () => useContext(EditorContext);

const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const editor = useEditor({
    immediatelyRender: false,
    injectCSS: false,
    extensions: [
      StarterKit.configure({
        paragraph: false,
        heading: false,
      }),
      Paragraph,
      Title,
      Chapter,
      ChapterDivider,
    ],
    content: `
        <div class="editor-content">
          <chapter-divider data-position="top"></chapter-divider>
          <chapter>
            <title>Chapter 1</title>
            <paragraph>Start writing your story...</paragraph>
          </chapter>
          <chapter-divider data-position="bottom"></chapter-divider>
        </div>
      `,
    editorProps: {
      attributes: {
        class: "tiptap-editor",
      },
    },
    onUpdate: ({ editor }) => {
      const docJSON = editor.getJSON();
      const chaptersData = extractChaptersFromDoc(docJSON);
      console.log(chaptersData);
    },
  });

  const toggleComment = () => {
    if (!editor) return;

    const { state, commands } = editor;
    const { from, to } = state.selection;

    if (from !== to) {
      const selectedText = state.doc.textBetween(from, to);
      editor
        .chain()
        .deleteRange({ from, to })
        .insertContentAt(from, `[${selectedText}]`)
        .setTextSelection(from + selectedText.length + 2)
        .run();
    } else {
      editor
        .chain()
        .insertContent("[]")
        .setTextSelection(from + 1)
        .run();
    }
  };

  return (
    <EditorContext.Provider value={{ editor, toggleComment }}>
      {children}
    </EditorContext.Provider>
  );
};

export default EditorProvider;
