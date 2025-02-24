// extensions/Chapter.ts
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ChapterNodeView from "../components/ChapterNodeView";

// extensions/Chapter.ts
const Chapter = Node.create({
  name: "chapter",
  group: "block",
  content: "title paragraph+", // one title followed by one or more paragraphs
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

// extensions/ChapterDivider.ts
// import ChapterDividerNodeView from "../components/ChapterDividerNodeView";

// export const ChapterDivider = Node.create({
//   name: "chapterDivider",
//   group: "block",
//   selectable: false,
//   atom: true,

//   addAttributes() {
//     return {
//       position: {
//         default: "bottom",
//         parseHTML: (element) =>
//           element.getAttribute("data-position") || "bottom",
//         renderHTML: (attributes) => {
//           return {
//             "data-position": attributes.position,
//           };
//         },
//       },
//     };
//   },

//   parseHTML() {
//     return [{ tag: "chapter-divider" }];
//   },

//   renderHTML({ HTMLAttributes }) {
//     return ["chapter-divider", mergeAttributes(HTMLAttributes), 0];
//   },

//   addCommands() {
//     return {
//       insertChapter:
//         (position: any) =>
//         ({ chain, state }: any) => {
//           return chain()
//             .insertContent({
//               type: this.name === "chapterDivider" ? "chapter" : "chapter",
//               content: [
//                 {
//                   type: "title",
//                   content: [{ type: "text", text: "New Chapter" }],
//                 },
//                 {
//                   type: "paragraph",
//                   content: [
//                     { type: "text", text: "Write your content here..." },
//                   ],
//                 },
//               ],
//             })
//             .run();
//         },
//     } as any;
//   },

//   addNodeView() {
//     return ReactNodeViewRenderer(ChapterDividerNodeView);
//   },
// });
