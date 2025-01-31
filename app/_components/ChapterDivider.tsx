import { AddIcon } from "../_assets/icons";

import { useScriptEditor } from "@/app/_contexts/ScriptEditorContext";
import { useAuth } from "@/app/_contexts/AuthContext";

export default function ChapterDivider({ position }: { position: number }) {
  const { user } = useAuth();

  const { script, addNode } = useScriptEditor();
  const scriptData = script.data;

  return (
    <div
      onClick={() => addNode(position, user)}
      className="group w-full py-1 cursor-pointer hover:opacity-100 opacity-0 transition-all duration-300 ease-in-out"
    >
      <div className="relative w-full invisible group-hover:visible flex items-center justify-center">
        <div className="group-hover:w-full w-0 h-[1px] bg-brand transition-all duration-200 ease-out rounded-full"></div>
        <button className="absolute top-0 bottom-0 left-0 right-0 m-auto h-6 w-6 rounded-full bg-brand grid place-items-center">
          <AddIcon className="text-primary h-2.5" />
        </button>
      </div>
    </div>
  );
}
