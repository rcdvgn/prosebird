import React from "react";
import { useRouter } from "next/navigation";
import { useScriptEditor } from "@/app/_contexts/ScriptEditorContext";
import { GroupByTime } from "./GroupByTime";
import { MoreIcon, ScriptIcon } from "@/app/_assets/icons";

const Scripts = ({ scripts, people }: any) => {
  if (!scripts || !people) return null;
  const { script: currentScript } = useScriptEditor();
  const router = useRouter();

  return (
    <GroupByTime unorganizedInstances={scripts} criteria="lastModified">
      {(script: any) => (
        <div
          onClick={() => router.push(`/file/${script.id}`)}
          className={`group h-11 w-full rounded-[10px] pl-[18px] pr-1 flex items-center justify-between cursor-pointer ${
            currentScript?.id === script.id
              ? "bg-battleground text-primary"
              : "text-inactive hover:text-primary hover:bg-hover"
          }`}
        >
          <div className="flex justify-start items-center grow min-w-0 gap-3">
            <ScriptIcon className="h-4 shrink-0" />
            <span className="block h-[18px] font-semibold text-[13px] truncate">
              {script?.title}
            </span>
          </div>
          <span
            className={`button-icon !bg-transparent ${
              currentScript?.id === script.id
                ? "text-primary"
                : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <MoreIcon className="h-3" />
          </span>
        </div>
      )}
    </GroupByTime>
  );
};

export default Scripts;
