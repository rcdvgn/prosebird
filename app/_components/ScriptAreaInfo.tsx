import { useScriptEditor } from "../_contexts/ScriptEditorContext";
export default function ScriptAreaInfo() {
  const { isSaved } = useScriptEditor();
  return (
    <div className="sticky bottom-0 left-0 w-full py-2 px-8 flex items-center justify-between">
      <span className="text-primary font-regular text-[13px]">
        {isSaved ? "All up to date!" : "Unsaved changes!"}
      </span>
    </div>
  );
}
