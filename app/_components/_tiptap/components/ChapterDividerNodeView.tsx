import React from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { AddIcon } from "@/app/_assets/icons";

const ChapterDividerNodeView = (props: any) => {
  const { editor, node, getPos } = props;
  const position = node.attrs.position || "bottom";

  const handleClick = () => {
    const pos = getPos();
    const completeChapter = [
      {
        type: "chapterDivider",
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
        type: "chapterDivider",
        attrs: { position: "bottom" },
      },
    ];

    editor
      .chain()
      .insertContentAt(pos + 1, completeChapter)
      .run();
  };

  return (
    <NodeViewWrapper>
      <div
        className={`absolute left-0 group w-full ${
          position === "top" ? "bottom-full" : "top-full"
        }`}
      >
        <div className="relative w-full flex justify-center">
          <div className="absolute w-full h-[1px] top-0 bottom-0 m-auto">
            <div className="group-hover:opacity-0 left-0 top-0 w-full h-full bg-stroke"></div>
            <div className="left-0 right-0 top-0 m-auto h-full bg-brand group-hover:w-full w-0"></div>
          </div>
          <button
            onClick={handleClick}
            className="z-10 m-auto h-7 w-7 rounded-full bg-brand grid place-items-center group-hover:opacity-100 opacity-0 transition-all duration-200 ease-in-out delay-75"
          >
            <AddIcon className="text-primary h-3" />
          </button>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default ChapterDividerNodeView;
