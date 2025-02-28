"use client";

import React from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import ChapterDivider from "../../ChapterDivider";

const ChapterNodeView = (props: any) => {
  const { node } = props;
  const chapterIndex = node.attrs?.position ? node.attrs.position : 0;

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
