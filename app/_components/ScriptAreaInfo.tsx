import { RedoIcon, UndoIcon } from "../_assets/icons";
import { useScriptEditor } from "../_contexts/ScriptEditorContext";
export default function ScriptAreaInfo() {
  const { isSaved } = useScriptEditor();
  return (
    <div className="sticky bottom-0 left-0 w-full">
      <div className="relative">
        <div className="absolute bottom-full left-0 w-full h-12 pointer-events-none bg-gradient-to-t from-middleground to-middleground/0"></div>

        <div className="bg-middleground w-full py-3 px-10 flex items-center justify-between">
          <span className="text-secondary font-medium text-xs">
            {isSaved ? "All up to date!" : "Unsaved changes!"}
          </span>

          <div className="flex items-center gap-3">
            <span className="button-icon">
              <UndoIcon className="w-3.5" />
            </span>

            <span className="button-icon">
              <RedoIcon className="w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
