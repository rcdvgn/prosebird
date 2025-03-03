"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react"; // Make sure this is imported
import TitleNodeView from "../components/TitleNodeView";

const Title = Node.create({
  name: "title",
  group: "block",
  content: "text*",
  marks: "",
  defining: true,

  addAttributes() {
    return {
      id: {
        default: null,
      },
      chapterSpeaker: {
        default: null,
      },
      position: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [{ tag: "title" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        class: "chapter-header flex gap-5",
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TitleNodeView);
  },
});

export default Title;
