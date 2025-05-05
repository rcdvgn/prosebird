"use client";

import React, { useEffect, useState } from "react";
import ListView from "./ListView";
import GridView from "./GridView";
import {
  VerticalArrowIcon,
  GridViewIcon,
  ListViewIcon,
  TriangleExpandIcon,
} from "../_assets/icons";
import { useRealtimeData } from "../_contexts/RealtimeDataContext";
import formatScript from "../_lib/formatScript";
import calculateTimestamps from "../_lib/addTimestamps";
import { getNodes, getUserPreferences } from "../_services/client";
import { useAuth } from "../_contexts/AuthContext";
import GenericFilters, { FilterConfig } from "./filters/GenericFilters";
import { isScriptShared } from "../_utils/isScriptShared";
import DropdownWrapper from "./wrappers/DropdownWrapper";
import matchToRole from "../_utils/matchToRole";
import { filterScripts, sortScripts } from "../_utils/organizeScripts";
import { useScriptEditor } from "../_contexts/ScriptEditorContext";

export default function AllDocuments() {
  const { scripts } = useRealtimeData();
  const { user } = useAuth();

  // Sorting state
  const [sorting, setSorting] = useState<any>({
    sortedBy: "lastModified",
    order: "desc",
  });
  const [isSortingOptionsVisible, setIsSortingOptionsVisible] =
    useState<boolean>(false);

  // Filter states
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [favoriteFilter, setFavoriteFilter] = useState<boolean>(false);
  const [sharedFilter, setSharedFilter] = useState<boolean>(false);

  // Dropdown visibility state for the role filter
  const [isRoleFilterOptionsVisible, setIsRoleFilterOptionsVisible] =
    useState<boolean>(false);

  const [displayType, setDisplayType] = useState<"grid" | "list">("grid");

  const [scriptsWithTimestamps, setScriptsWithTimestamps] = useState<any>(null);

  const itemWidth = 250;
  const itemPx = 18;
  const fontSize = "20";

  useEffect(() => {
    if (!scripts || !user?.id) return;

    const getScriptPreviews = async () => {
      try {
        const userPreferences: any = await getUserPreferences(user.id);

        const newScripts = await Promise.all(
          scripts.map(async (script: any) => {
            const nodes = await getNodes(script.id);

            const { formattedScript } = formatScript(nodes);

            const { scriptWithTimestamps, totalDuration } =
              await calculateTimestamps(
                formattedScript.words,
                formattedScript.chapters,
                itemWidth - itemPx * 2,
                userPreferences.speedMultiplier,
                fontSize
              );

            const lines = Object.values(scriptWithTimestamps).map((line: any) =>
              line.map((wordObj: any) => wordObj.word).join(" ")
            );

            return { ...script, lines, duration: totalDuration };
          })
        );

        setScriptsWithTimestamps(newScripts);
      } catch (error) {
        console.error("Error fetching script previews:", error);
      }
    };

    getScriptPreviews();
  }, [scripts, user?.id]);

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

  // Create the filter configuration array for the GenericFilters component
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

  const processedScripts = sortScripts(
    filterScripts(
      scriptsWithTimestamps,
      { roleFilter, favoriteFilter, sharedFilter },
      user
    ),
    sorting
  );

  return (
    <div className="grow px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <span className="font-extrabold text-xl text-primary">
          All documents
        </span>

        <div className="flex gap-1 items-center">
          <span
            onClick={() => setDisplayType("list")}
            className={`button-icon !h-9 ${
              displayType === "list" ? "!text-primary" : ""
            }`}
          >
            <ListViewIcon className="w-4" />
          </span>
          <span
            onClick={() => setDisplayType("grid")}
            className={`button-icon !h-9 ${
              displayType === "grid" ? "!text-primary" : ""
            }`}
          >
            <GridViewIcon className="h-4" />
          </span>
        </div>
      </div>

      <div className="flex justify-between h-8 w-full mb-6">
        <GenericFilters filters={filtersConfig} />

        <div className="h-full flex gap-1">
          <span
            onClick={() => {
              setSorting((currSorting: any) => ({
                ...currSorting,
                order: sorting.order === "asc" ? "desc" : "asc",
              }));
            }}
            className="z-0 grid place-items-center h-full aspect-square rounded-lg text-inactive hover:bg-hover hover:text-primary cursor-pointer"
          >
            <VerticalArrowIcon
              className={`h-3.5 transition-rotate duration-150 ease-in-out ${
                sorting.order === "asc" ? "" : "rotate-180"
              }`}
            />
          </span>

          <DropdownWrapper
            align="right"
            isVisible={isSortingOptionsVisible}
            setIsVisible={setIsSortingOptionsVisible}
            optionGroups={[
              [
                {
                  text: "Title",
                  onClick: () => {
                    setSorting((currSorting: any) => ({
                      ...currSorting,
                      sortedBy: "title",
                    }));
                  },
                },
                {
                  text: "Last modified",
                  onClick: () => {
                    setSorting((currSorting: any) => ({
                      ...currSorting,
                      sortedBy: "lastModified",
                    }));
                  },
                },
              ],
            ]}
          >
            <span
              className={`flex items-center gap-2 rounded-lg p-2 cursor-pointer ${
                isSortingOptionsVisible
                  ? "bg-hover text-primary"
                  : "text-inactive hover:bg-hover hover:text-primary"
              }`}
            >
              <span className="text-[13px] font-semibold">
                {sorting.sortedBy === "title" ? "Title" : "Last modified"}
              </span>
              <TriangleExpandIcon
                className={`w-1.5 transition-rotate duration-150 ease-in-out ${
                  isSortingOptionsVisible ? "rotate-180" : ""
                }`}
              />
            </span>
          </DropdownWrapper>
        </div>
      </div>

      <ListView
        displayType={displayType}
        scriptsWithTimestamps={processedScripts}
        sorting={sorting}
        setSorting={setSorting}
      />
      <GridView
        displayType={displayType}
        scriptsWithTimestamps={processedScripts}
        itemWidth={itemWidth}
        itemPx={itemPx}
        fontSize={fontSize}
        sorting={sorting}
        setSorting={setSorting}
      />
    </div>
  );
}
