// extensions/Chapter.ts
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ChapterNodeView from "../components/ChapterNodeView";

// extensions/Chapter.ts
export const Chapter = Node.create({
  name: "chapter",
  group: "block",
  content: "title paragraph+", // one title followed by one or more paragraphs
  defining: true,

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

// extensions/Title.ts
export const Title = Node.create({
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

// extensions/Paragraph.ts

export const Paragraph = Node.create({
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

// extensions/ChapterDivider.ts
import ChapterDividerNodeView from "../components/ChapterDividerNodeView";

export const ChapterDivider = Node.create({
  name: "chapterDivider",
  group: "block",
  selectable: false,
  atom: true,

  addAttributes() {
    return {
      position: {
        default: "bottom",
        parseHTML: (element) =>
          element.getAttribute("data-position") || "bottom",
        renderHTML: (attributes) => {
          return {
            "data-position": attributes.position,
          };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "chapter-divider" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["chapter-divider", mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      insertChapter:
        (position: any) =>
        ({ chain, state }: any) => {
          return chain()
            .insertContent({
              type: this.name === "chapterDivider" ? "chapter" : "chapter",
              content: [
                {
                  type: "title",
                  content: [{ type: "text", text: "New Chapter" }],
                },
                {
                  type: "paragraph",
                  content: [
                    { type: "text", text: "Write your content here..." },
                  ],
                },
              ],
            })
            .run();
        },
    } as any;
  },

  addNodeView() {
    return ReactNodeViewRenderer(ChapterDividerNodeView);
  },
});
