import ChapterDivider from "./ChapterDivider";
import ScriptNode from "./ScriptNode";
import { useScriptEditor } from "@/app/contexts/ScriptEditorContext";

export default function ScriptArea() {
  const { scriptData } = useScriptEditor();

  return (
    <div className="w-[683px] min-h-full pt-[15px]">
      <ChapterDivider position={0} />
      {[...scriptData.nodes]
        .sort(
          (a, b) => scriptData.nodes.indexOf(a) - scriptData.nodes.indexOf(b)
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
