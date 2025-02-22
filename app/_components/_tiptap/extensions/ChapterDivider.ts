import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ChapterDividerNodeView from "../components/ChapterDividerNodeView";

export const ChapterDivider = Node.create({
  name: "chapterDivider",
  group: "block",
  selectable: false,
  atom: true, // It's an atomic node – no children

  parseHTML() {
    return [{ tag: "chapter-divider" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["chapter-divider", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ChapterDividerNodeView);
  },
});
