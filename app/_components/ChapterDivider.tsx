import { AddIcon } from "../_assets/icons";

import { useScriptEditor } from "@/app/_contexts/ScriptEditorContext";
import { useAuth } from "@/app/_contexts/AuthContext";

export default function ChapterDivider({ className, position }: any) {
  const { user } = useAuth();

  const { script, addNode } = useScriptEditor();

  return (
    <div
      className={`group-hover/chapter:block hidden absolute left-0 group w-full ${className}`}
    >
      <div className="relative w-full flex justify-center">
        <div className="absolute w-full h-[1px] top-0 bottom-0 m-auto">
          <div className="group-hover:opacity-0 left-0 top-0 w-full h-full bg-stroke"></div>

          <div className="left-0 right-0 top-0 m-auto h-full bg-brand group-hover:w-full w-0 transition-all duration-200 ease-in-out delay-75"></div>
        </div>

        <button
          onClick={() => addNode(position, user, script?.nodes.length)}
          className="z-10 m-auto h-7 w-7 rounded-full bg-brand grid place-items-center group-hover:opacity-100 opacity-0 transition-all duration-200 ease-in-out delay-75"
        >
          <AddIcon className="text-primary h-3" />
        </button>
      </div>
    </div>
  );
}
