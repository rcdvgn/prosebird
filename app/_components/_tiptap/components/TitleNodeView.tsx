import React, { useEffect } from "react";
import { NodeViewProps, NodeViewContent, NodeViewWrapper } from "@tiptap/react";

const TitleNodeView: React.FC<NodeViewProps> = (props: any) => {
  return (
    <NodeViewWrapper className="chapter-header flex gap-4 mb-4">
      <div
        className="speaker-image h-[34px] aspect-square rounded-full bg-cover bg-center cursor-pointer"
        style={{ backgroundImage: "url('/pfps/profile1.png')" }}
      />

      <h1 className="tiptap-title">
        <NodeViewContent />
      </h1>
    </NodeViewWrapper>
  );
};

export default TitleNodeView;
