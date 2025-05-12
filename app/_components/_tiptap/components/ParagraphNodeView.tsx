"use client";
import { useScriptEditor } from "@/app/_contexts/ScriptEditorContext";
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";

const ParagraphNodeView = (props: NodeViewProps) => {
  const { node } = props;

  const { nodes } = useScriptEditor();

  const placeholder = "Say something great...";
  const position = node.attrs.position;

  const contentText = node.textContent;
  const isEffectivelyEmpty = contentText === "" || contentText === "\u200B";

  return (
    <NodeViewWrapper
      className="tiptap-paragraph relative"
      style={{ textAlign: node.attrs.textAlign || "left" }}
    >
      {position !== null &&
        isEffectivelyEmpty &&
        nodes[position].paragraphs.length <= 1 && (
          <span
            className="tiptap-paragraph absolute pointer-events-none text-placeholder top-0 left-0"
            style={{ userSelect: "none" }}
          >
            {placeholder}
          </span>
        )}
      <NodeViewContent />
    </NodeViewWrapper>
  );
};

export default ParagraphNodeView;
