import { Node, mergeAttributes } from "@tiptap/core";

const Title = Node.create({
  name: "title",
  group: "block",
  content: "text*",
  marks: "",
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
          class:
            "speaker-image mr-5 h-[34px] aspect-square rounded-full bg-cover bg-center cursor-pointer",
          style: "background-image: url('/pfps/profile1.png')",
        },
      ],
      ["h1", { class: "tiptap-title" }, 0],
    ];
  },
});

export default Title;
