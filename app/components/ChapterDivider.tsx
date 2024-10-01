import { AddIcon } from "../assets/icons";

import { useScriptEditor } from "@/app/contexts/ScriptEditorContext";

export default function ChapterDivider({ position }: { position: number }) {
  const { script, addNode } = useScriptEditor();
  const scriptData = script.data;

  return (
    <div className="group w-full h-[30px] flex items-center justify-center">
      <div className="relative w-full flex flex-col gap-1.5 invisible group-hover:visible">
        <div
          className={`${
            position > 0 ? "" : "invisible"
          } h-2 rounded-sm border-stroke border-x-[1px] border-b-[1px]`}
        ></div>
        <div
          className={`${
            position === scriptData.nodes.length ? "invisible" : ""
          } h-2 rounded-sm border-stroke border-x-[1px] border-t-[1px]`}
        ></div>
        <button
          onClick={() => addNode(position)}
          className="absolute top-0 bottom-0 right-0 left-0 m-auto h-fit w-fit btn-2-sm"
        >
          <AddIcon className="fill-text-primary w-2" />
          <span className="">Chapter</span>
        </button>
      </div>
    </div>
  );
}
