// tiptap.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Chapter, Title, Paragraph } from "./extensions/Chapter";
import { ChapterDivider } from "./extensions/ChapterDivider";

function extractChaptersFromDoc(doc: any) {
  if (!doc || !doc.content) return [];

  return doc.content
    .filter((node: any) => node.type === "chapter")
    .map((chapter: any) => {
      // Extract the title text from the title node
      const titleNode = chapter.content.find(
        (child: any) => child.type === "title"
      );
      const titleText = titleNode
        ? titleNode.content?.map((c: any) => c.text).join("")
        : "";

      // Extract all paragraphs (for now, treating them as default paragraphs)
      const paragraphs = chapter.content
        .filter((child: any) => child.type === "paragraph")
        .map((para: any) => para.content?.map((c: any) => c.text).join(""));

      // Assume the speaker is stored as an attribute on the chapter node
      const speaker = chapter.attrs?.speaker || undefined;

      return { title: titleText, paragraphs, speaker };
    });
}

const Tiptap = () => {
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
      // Convert it to an array of chapter objects
      const chaptersData = extractChaptersFromDoc(docJSON);
      // Now chaptersData looks like:
      // [
      //   { title: "Chapter 1", paragraphs: ["Paragraph text..."], speaker: "John Doe" },
      //   ...
      // ]
      // You can then store it in state, send it to your backend, or pass it to your presentation component.
      console.log(chaptersData);
    },
  });

  return (
    <div className="tiptap-editor-parent">
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
