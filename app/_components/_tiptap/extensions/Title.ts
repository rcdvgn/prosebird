import { Node, mergeAttributes } from "@tiptap/core";

const Title = Node.create({
  name: "title",
  group: "block",
  content: "text*",
  defining: true,

  parseHTML() {
    return [{ tag: "title" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        class: "chapter-header flex items-center",
      }),
      [
        "div",
        {
          class: "speaker-image mr-5 h-9 w-9 rounded-full bg-cover bg-center",
          style: "background-image: url('/pfps/profile1.png')",
        },
      ],
      ["h1", { class: "tiptap-title" }, 0],
    ];
  },
});

export default Title;
