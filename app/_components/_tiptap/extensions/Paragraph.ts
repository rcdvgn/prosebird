"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import ParagraphNodeView from "../components/ParagraphNodeView";
import { ReactNodeViewRenderer } from "@tiptap/react";

const Paragraph = Node.create({
  name: "paragraph",
  group: "block",
  content: "inline*",
  marks: "comment bold italic",

  addAttributes() {
    return {
      position: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [{ tag: "paragraph" }, { tag: "p" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "p",
      mergeAttributes(HTMLAttributes, { class: "tiptap-paragraph" }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ParagraphNodeView);
  },
});

export default Paragraph;
