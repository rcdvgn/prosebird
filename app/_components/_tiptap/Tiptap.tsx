"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { useScriptEditor } from "@/app/_contexts/ScriptEditorContext";
import { useEffect } from "react";
import Paragraph from "./extensions/Paragraph";
import Title from "./extensions/Title";
import Chapter from "./extensions/Chapter";
import ChapterDivider from "./extensions/ChapterDivider";

import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import History from "@tiptap/extension-history";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import { Comment } from "./extensions/CommentMark";

const Tiptap = () => {
  const { setEditor, nodes } = useScriptEditor();

  const CustomHistory = History.extend({
    addKeyboardShortcuts() {
      return {
        "Mod-z": () => this.editor.commands.undo(),
        "Mod-y": () => this.editor.commands.redo(),
      };
    },
  });

  const editor = useEditor({
    immediatelyRender: false,
    injectCSS: false,
    extensions: [
      Document,
      Text,
      Paragraph,
      Title,
      Chapter,
      ChapterDivider,
      CustomHistory,
      Comment,
      Bold,
      Italic,
      TextAlign.configure({
        types: ["paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
      TextStyle,
      FontFamily,
    ],
    editorProps: {
      attributes: {
        class: "tiptap-editor",
      },
    },
    // We no longer need onUpdate here as we set up a listener in the context
  });

  // Register the editor with our context when it's ready
  useEffect(() => {
    if (editor) {
      setEditor(editor);
    }
  }, [editor, setEditor]);

  if (!editor) return null;

  return (
    <div className="tiptap-editor-parent">
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
