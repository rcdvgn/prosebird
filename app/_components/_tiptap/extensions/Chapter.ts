// extensions/Chapter.ts
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ChapterNodeView from "../components/ChapterNodeView";

// extensions/Chapter.ts
const Chapter = Node.create({
  name: "chapter",
  group: "block",
  content: "title paragraph+",
  defining: true,

  addAttributes() {
    return {
      id: {
        default: null,
      },
      speaker: {
        default: null,
      },
      position: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [{ tag: "chapter" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        class: "group/chapter relative w-full my-6",
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ChapterNodeView);
  },
});

export default Chapter;
