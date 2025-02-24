import { Node, mergeAttributes } from "@tiptap/core";

const Paragraph = Node.create({
  name: "paragraph",
  group: "block",
  content: "inline*",

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
});

export default Paragraph;
