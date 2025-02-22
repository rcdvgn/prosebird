import React from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { AddIcon } from "@/app/_assets/icons";
import ChapterDivider from "../../ChapterDivider";

// components/ChapterNodeView.tsx
const ChapterNodeView = (props: any) => {
  const { editor, node, getPos } = props;

  // Common handler to insert a new chapter group (could insert above or below)
  const handleAddChapter = () => {
    const pos = getPos();
    const completeChapter = [
      {
        type: "chapter-divider",
        attrs: { position: "top" },
      },
      {
        type: "chapter",
        content: [
          {
            type: "title",
            content: [{ type: "text", text: "New Chapter" }],
          },
          {
            type: "paragraph",
            content: [{ type: "text", text: "Write your content here..." }],
          },
        ],
      },
      {
        type: "chapter-divider",
        attrs: { position: "bottom" },
      },
    ];
    editor
      .chain()
      .insertContentAt(pos + 1, completeChapter)
      .run();
  };

  return (
    <NodeViewWrapper className="grow w-full px-12 pt-10 flex flex-col justify-start items-center gap-7">
      <div className="max-w-[800px] w-full">
        <div className="group/chapter relative">
          <ChapterDivider className="bottom-full" />

          <div className="py-[18px]">
            <NodeViewContent />
          </div>

          <ChapterDivider className="top-full" />
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default ChapterNodeView;
