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

  renderHTML({ node, HTMLAttributes }) {
    return [
      "p",
      {
        ...HTMLAttributes,
        style: `text-align: ${node.attrs.textAlign || "left"}; ${
          HTMLAttributes.style || ""
        }`,
        class: `tiptap-paragraph ${HTMLAttributes.class || ""}`,
      },
      0,
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ParagraphNodeView);
  },
});

export default Paragraph;
