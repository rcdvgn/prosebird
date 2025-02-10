"use client";

import React, { useEffect, useState } from "react";
import ListView from "./ListView";
import GridView from "./GridView";
import { GridViewIcon, ListViewIcon } from "../_assets/icons";
import { useRealtimeData } from "../_contexts/RealtimeDataContext";
import formatScript from "../_lib/formatScript";
import calculateTimestamps from "../_lib/addTimestamps";
import { getNodes, getUserPreferences } from "../_services/client";
import { useAuth } from "../_contexts/AuthContext";

export default function AllDocuments() {
  // const { recentlyModified } = useRecentScripts();
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

  return (
    <div className="grow px-8 py-6">
      <div className="flex justify-between items-center mb-10">
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

      <ListView
        displayType={displayType}
        scriptsWithTimestamps={scriptsWithTimestamps}
      />
      <GridView
        displayType={displayType}
        scriptsWithTimestamps={scriptsWithTimestamps}
        itemWidth={itemWidth}
        itemPx={itemPx}
        fontSize={fontSize}
      />
    </div>
  );
}
