import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useScriptEditor } from "@/app/_contexts/ScriptEditorContext";
import { GroupByTime } from "./GroupByTime";
import { MoreIcon, ScriptIcon } from "@/app/_assets/icons";
import GenericFilters, { FilterConfig } from "../filters/GenericFilters";
import { isScriptShared } from "@/app/_utils/isScriptShared";
import matchToRole from "@/app/_utils/matchToRole";
import { filterScripts } from "@/app/_utils/organizeScripts";

const Scripts = ({ scripts, people, user }: any) => {
  if (!scripts || !people) return null;
  const { script: currentScript } = useScriptEditor();
  const router = useRouter();

  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [favoriteFilter, setFavoriteFilter] = useState<boolean>(false);
  const [sharedFilter, setSharedFilter] = useState<boolean>(false);

  const [isRoleFilterOptionsVisible, setIsRoleFilterOptionsVisible] =
    useState<boolean>(false);

  const roleFilterOptions = [
    {
      text: "Author",
      onClick: () => {
        setRoleFilter("Author");
        setIsRoleFilterOptionsVisible(false);
      },
    },
    {
      text: "Editor",
      onClick: () => {
        setRoleFilter("Editor");
        setIsRoleFilterOptionsVisible(false);
      },
    },
    {
      text: "Viewer",
      onClick: () => {
        setRoleFilter("Viewer");
        setIsRoleFilterOptionsVisible(false);
      },
    },
  ];

  const filtersConfig: FilterConfig[] = [
    {
      type: "dropdown",
      label: "Role",
      value: roleFilter,
      isVisible: isRoleFilterOptionsVisible,
      setIsVisible: setIsRoleFilterOptionsVisible,
      options: roleFilterOptions,
      onClear: () => setRoleFilter(null),
    },
    {
      type: "toggle",
      label: "Favorite",
      value: favoriteFilter,
      onToggle: () => setFavoriteFilter((curr) => !curr),
      onClear: () => setFavoriteFilter(false),
    },
    {
      type: "toggle",
      label: "Shared",
      value: sharedFilter,
      onToggle: () => setSharedFilter((curr) => !curr),
      onClear: () => setSharedFilter(false),
    },
  ];

  const filteredScripts = filterScripts(
    scripts,
    { roleFilter, favoriteFilter, sharedFilter },
    user
  );

  return (
    <>
      <div className="relative flex w-full mb-5 h-8 overflow-x-clip overflow-y-visible">
        <GenericFilters filters={filtersConfig} />
      </div>

      <GroupByTime
        unorganizedInstances={filteredScripts}
        criteria="lastModified"
      >
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
    </>
  );
};

export default Scripts;
