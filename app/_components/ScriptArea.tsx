import ChapterDivider from "./ChapterDivider";
import ScriptNode from "./ScriptNode";
import { useScriptEditor } from "@/app/_contexts/ScriptEditorContext";

export default function ScriptArea({ editorOptions, setEditorOptions }: any) {
  const { script } = useScriptEditor();

  const focusOnLastNode = () => {
    const lastIndex = script?.nodes.length - 1;
    const lastParagraph = document.getElementById(
      `chapterParagraph-${lastIndex}`
    ) as HTMLTextAreaElement;

    if (lastParagraph) {
      lastParagraph.focus();
      lastParagraph.setSelectionRange(
        lastParagraph.value.length,
        lastParagraph.value.length
      );
    }
  };

  return (
    <div className="grow w-full px-12 pt-10 flex flex-col justify-start items-center gap-7">
      <div className="flex flex-col gap-7 max-w-[800px] w-full">
        {/* <ChapterDivider position={0} /> */}
        {script.nodes &&
          script.nodes
            .sort(
              (a: any, b: any) =>
                script.nodes.indexOf(a) - script.nodes.indexOf(b)
            )
            .map((node: any, index: any) => {
              return (
                <div className="group/chapter relative" key={index}>
                  <ChapterDivider className="bottom-full" position={index} />

                  <div className="flex justify-center py-[18px]">
                    <ScriptNode
                      editorOptions={editorOptions}
                      setEditorOptions={setEditorOptions}
                      node={node}
                      position={index}
                    />
                  </div>

                  <ChapterDivider className="top-full" position={index + 1} />
                </div>
              );
            })}
      </div>

      <div
        onClick={focusOnLastNode}
        className="grow cursor-text w-full min-h-0"
      ></div>
    </div>
  );
}
