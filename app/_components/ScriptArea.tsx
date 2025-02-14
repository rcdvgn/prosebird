import ChapterDivider from "./ChapterDivider";
import ScriptNode from "./ScriptNode";
import { useScriptEditor } from "@/app/_contexts/ScriptEditorContext";

export default function ScriptArea() {
  const { script } = useScriptEditor();
  const scriptData = script.data;

  return (
    <div className="w-[683px] pt-[15px] grow flex flex-col gap-7">
      {/* <ChapterDivider position={0} /> */}
      {[...scriptData.nodes]
        .sort(
          (a, b) => scriptData.nodes.indexOf(a) - scriptData.nodes.indexOf(b)
        )
        .map((node: any, index: any) => {
          return (
            <div className="group/chapter relative" key={index}>
              <ChapterDivider className="bottom-full" position={index} />

              <div className="flex justify-center py-8">
                <ScriptNode node={node} position={index} />
              </div>

              <ChapterDivider className="top-full" position={index + 1} />
            </div>
          );
        })}
    </div>
  );
}
