import { LoadingIcon, RedoIcon, SavedIcon, UndoIcon } from "../_assets/icons";
import { useScriptEditor } from "../_contexts/ScriptEditorContext";
import TooltipWrapper from "./wrappers/TooltipWrapper";
export default function ScriptAreaInfo() {
  const { isSaved } = useScriptEditor();
  const { editor } = useScriptEditor();

  const canUndo = editor ? editor.can().undo() : false;
  const canRedo = editor ? editor.can().redo() : false;

  return (
    <div className="sticky bottom-0 left-0 w-full">
      <div className="relative">
        {/* <div className="absolute bottom-full left-0 w-full h-12 pointer-events-none bg-gradient-to-t from-middleground to-middleground/0"></div> */}

        <div className="bg-middleground w-full py-3 px-10 flex items-center justify-between">
          <span className="text-secondary font-medium text-xs">
            {isSaved ? (
              <TooltipWrapper
                position="right"
                data={{
                  text: "Up to date, all changes have been saved.",
                }}
              >
                <span className="text-secondary h-8 aspect-square grid place-items-center">
                  <SavedIcon className="h-3" />
                </span>
              </TooltipWrapper>
            ) : (
              <span className="text-secondary h-8 aspect-square grid place-items-center">
                <LoadingIcon className="h-3 animate-spin" />
              </span>
            )}
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                editor ? editor.chain().focus().undo().run() : "";
              }}
              disabled={!canUndo}
              className={`button-icon`}
            >
              <UndoIcon className="w-3.5" />
            </button>

            <button
              onClick={() => {
                editor ? editor.chain().focus().redo().run() : "";
              }}
              disabled={!canRedo}
              className={`button-icon`}
            >
              <RedoIcon className="w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
