import React, { useEffect } from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { AddIcon } from "@/app/_assets/icons";
import ChapterDivider from "../../ChapterDivider";

// components/ChapterNodeView.tsx
const ChapterNodeView = (props: any) => {
  const { node } = props;
  // Read the stored index (or default to 0)
  const chapterIndex = node.attrs?.position ? node.attrs.position : 0;

  // useEffect(() => {
  //   console.log(node);
  // }, [node]);

  const topDividerPosition = chapterIndex;
  const bottomDividerPosition = chapterIndex + 1;

  return (
    <NodeViewWrapper className="h-full w-full">
      <div className="group/chapter relative py-[18px]">
        <ChapterDivider className="bottom-full" position={topDividerPosition} />

        <NodeViewContent />

        <ChapterDivider className="top-full" position={bottomDividerPosition} />
      </div>
    </NodeViewWrapper>
  );
};

export default ChapterNodeView;
