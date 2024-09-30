import { useRef, useState, useEffect } from "react";
import ChapterDivider from "./ChapterDivider";
import ScriptNode from "./ScriptNode";
import { useScriptEditor } from "@/app/contexts/ScriptEditorContext";

export default function ScriptArea() {
  const { scriptNodes } = useScriptEditor();

  return (
    <div className="w-[683px] min-h-full pt-[15px]">
      <ChapterDivider position={0} />
      {[...scriptNodes.nodes]
        .sort(
          (a, b) => scriptNodes.nodes.indexOf(a) - scriptNodes.nodes.indexOf(b)
        )
        .map((node: any, index: any) => {
          return (
            <div key={node.id}>
              <ScriptNode node={node} position={index} />
              <ChapterDivider position={index + 1} />
            </div>
          );
        })}
    </div>
  );
}
