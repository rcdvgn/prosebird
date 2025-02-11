"use client";

import React, { useEffect, useState } from "react";
import ListView from "./ListView";
import GridView from "./GridView";
import {
  ArrowIcon,
  XIcon,
  GridViewIcon,
  ListViewIcon,
  TriangleExpandIcon,
} from "../_assets/icons";
import { useRealtimeData } from "../_contexts/RealtimeDataContext";
import formatScript from "../_lib/formatScript";
import calculateTimestamps from "../_lib/addTimestamps";
import { getNodes, getUserPreferences } from "../_services/client";
import { useAuth } from "../_contexts/AuthContext";
import { lastModifiedFormatter } from "../_utils/lastModifiedFormater";
import DropdownWrapper from "./wrappers/DropdownWrapper";

export default function AllDocuments() {
  // const { recentlyModified } = useRecentScripts();

  const [sorting, setSorting] = useState<any>({
    sortedBy: "lastModified",
    order: "desc",
  });

  const [isSortingOptionsVisible, setIsSortingOptionsVisible] =
    useState<any>(false);

  const [isRoleFilterOptionsVisible, setIsRoleFilterOptionsVisible] =
    useState<any>(false);

  const [roleFilter, setRoleFilter] = useState<any>(null);

  const { scripts } = useRealtimeData();
  const { user } = useAuth();

  const [displayType, setDisplayType] = useState<any>("grid");

  const [scriptsWithTimestamps, setScriptsWithTimestamps] = useState<any>(null);

  const itemWidth: any = 250;
  const itemPx: any = 18;
  const fontSize: any = "20";

  useEffect(() => {
    if (!scripts || !user?.id) return;

    const getScriptPreviews = async () => {
      try {
        const userPreferences: any = await getUserPreferences(user.id);

        const newRecentlyModifiedScripts = await Promise.all(
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

        setScriptsWithTimestamps(newRecentlyModifiedScripts);
      } catch (error) {
        console.error("Error fetching script previews:", error);
      }
    };

    getScriptPreviews();
  }, [scripts, user?.id]);

  const sortScripts = (scripts: any) => {
    if (!scripts) return;

    let sortedScripts;

    if (sorting.sortedBy === "lastModified") {
      sortedScripts = [...scripts];
    } else if (sorting.sortedBy === "title") {
      sortedScripts = scripts.sort((a: any, b: any) =>
        a.title
          .toLowerCase()
          .localeCompare(b.title.toLowerCase(), undefined, { numeric: true })
      );
    } else {
      sortedScripts = [];
    }

    const matchRole = (script: any) => {
      if (roleFilter === "Author" && script.createdBy === user?.id) return true;
      if (roleFilter === "Editor" && script.editors.includes(user?.id))
        return true;
      if (roleFilter === "Viewer" && script.viewers.includes(user?.id))
        return true;

      return false;
    };

    const filteredScripts = sortedScripts.filter((script: any) => {
      const filterByRole = roleFilter ? matchRole(script) : true;

      return filterByRole;
    });

    return sorting.order === "asc"
      ? filteredScripts.reverse()
      : filteredScripts;
  };

  const roleFilterOptions = [
    { text: "Author", onClick: () => setRoleFilter("Author") },
    { text: "Editor", onClick: () => setRoleFilter("Editor") },
    { text: "Viewer", onClick: () => setRoleFilter("Viewer") },
  ];

  return (
    <div className="grow px-8 py-6">
      <div className="flex justify-between items-center mb-8">
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
        <div className="flex items-center gap-2">
          {roleFilter ? (
            <div className="flex gap-[1px] h-8">
              <DropdownWrapper
                isVisible={isRoleFilterOptionsVisible}
                setIsVisible={setIsRoleFilterOptionsVisible}
                options={roleFilterOptions}
              >
                <div className="filter-1-selected !rounded-r-none">
                  <span className="font-semibold text-[13px] flex items-center">
                    {roleFilter}
                  </span>
                  <TriangleExpandIcon
                    className={`w-1.5 transition-rotate duration-150 ease-in-out ${
                      isRoleFilterOptionsVisible ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </DropdownWrapper>

              <div
                onClick={() => setRoleFilter(null)}
                className="filter-1-selected-clear"
              >
                <XIcon className="h-2" />
              </div>
            </div>
          ) : (
            <DropdownWrapper
              isVisible={isRoleFilterOptionsVisible}
              setIsVisible={setIsRoleFilterOptionsVisible}
              options={roleFilterOptions}
            >
              <div className="filter-1-default">
                <span className="font-semibold text-[13px]">Role</span>
                <TriangleExpandIcon
                  className={`w-1.5 transition-rotate duration-150 ease-in-out ${
                    isRoleFilterOptionsVisible ? "rotate-180" : ""
                  }`}
                />
              </div>
            </DropdownWrapper>
          )}
        </div>

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
            <ArrowIcon
              className={`h-3.5 transition-rotate duration-150 ease-in-out ${
                sorting.order === "asc" ? "" : "rotate-180"
              }`}
            />
          </span>

          <DropdownWrapper
            align="right"
            isVisible={isSortingOptionsVisible}
            setIsVisible={setIsSortingOptionsVisible}
            options={[
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
                {sorting === "createdAt" ? "Created at" : "Last modified"}
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
        scriptsWithTimestamps={sortScripts(scriptsWithTimestamps)}
        sorting={sorting}
        setSorting={setSorting}
      />
      <GridView
        displayType={displayType}
        scriptsWithTimestamps={sortScripts(scriptsWithTimestamps)}
        itemWidth={itemWidth}
        itemPx={itemPx}
        fontSize={fontSize}
        sorting={sorting}
        setSorting={setSorting}
      />
    </div>
  );
}
