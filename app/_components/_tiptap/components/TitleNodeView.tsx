import React from "react";
import { NodeViewProps, NodeViewContent, NodeViewWrapper } from "@tiptap/react";

const TitleNodeView: React.FC<NodeViewProps> = (props: any) => {
  const { node, editor } = props;
  const position = node.attrs?.position || 0;

  // Dynamic placeholder based on chapter position
  const placeholder = `Chapter ${position + 1}`;

  // Get content of the title to check if it's empty
  const contentText = node.textContent;
  const isEffectivelyEmpty = contentText === "" || contentText === "\u200B";

  return (
    <NodeViewWrapper className="chapter-header flex gap-4 mb-4 relative">
      <div
        className="speaker-image h-[34px] aspect-square rounded-full bg-cover bg-center cursor-pointer"
        style={{ backgroundImage: "url('/pfps/profile1.png')" }}
      />

      <div className="w-full relative">
        {isEffectivelyEmpty && (
          <span className="tiptap-title absolute pointer-events-none !text-placeholder top-0 left-0">
            {placeholder}
          </span>
        )}
        <h1 className="tiptap-title min-h-[24px]">
          <NodeViewContent />
        </h1>
      </div>
    </NodeViewWrapper>
  );
};

export default TitleNodeView;
