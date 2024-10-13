import ChapterDivider from "./ChapterDivider";
import ScriptNode from "./ScriptNode";
import { useScriptEditor } from "@/app/contexts/ScriptEditorContext";

export default function ScriptArea() {
  const { script } = useScriptEditor();
  const scriptData = script.data;

  return (
    <div className="w-full pt-[15px] grow">
      <ChapterDivider position={0} />
      {[...scriptData.nodes]
        .sort(
          (a, b) => scriptData.nodes.indexOf(a) - scriptData.nodes.indexOf(b)
        )
        .map((node: any, index: any) => {
          return (
            <div key={node.id}>
              <div className="flex justify-center hover:border-stroke border-transparent border-y-[1px] py-4">
                <ScriptNode node={node} position={index} />
              </div>

              <ChapterDivider position={index + 1} />
            </div>
          );
        })}
    </div>
  );
}
