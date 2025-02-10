"use client";

import {
  ClockIcon,
  CollaboratorsIcon,
  IsFavoriteIcon,
  MoreIcon,
} from "@/app/_assets/icons";

import React, { useEffect, useState } from "react";
import calculateTimestamps from "../_lib/addTimestamps";
import formatScript from "../_lib/formatScript";
import { getNodes, getUserPreferences } from "../_services/client";
import { useAuth } from "../_contexts/AuthContext";
import formatTimestamp from "../_utils/formatTimestamp";
import { useRouter } from "next/navigation";
import { useRealtimeData } from "../_contexts/RealtimeDataContext";

export default function GridView({ displayType }: any) {
  const { user } = useAuth();
  const { scripts } = useRealtimeData();

  const router = useRouter();

  const [recentlyModifiedScripts, setRecentlyModifiedScripts] =
    useState<any>(null);

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

        setRecentlyModifiedScripts(newRecentlyModifiedScripts);
      } catch (error) {
        console.error("Error fetching script previews:", error);
      }
    };

    getScriptPreviews();
  }, [scripts, user?.id]);

  return (
    <div
      className={`gap-y-7 gap-x-5 ${
        displayType === "grid" ? "grid" : "hidden"
      }`}
      style={{
        gridTemplateColumns: `repeat(auto-fill, ${itemWidth}px)`,
      }}
    >
      {recentlyModifiedScripts &&
        recentlyModifiedScripts.map((script: any, index: any) => {
          return (
            <div
              key={index}
              onClick={() => router.push(`/file/${script.id}`)}
              className="group/container w-full ring-1 ring-stroke hover:ring-border rounded-[10px] cursor-pointer hover:translate-y-[-5px] transition-all duration-200 ease-in-out"
            >
              <div
                className="relative w-full h-[178px] pt-3 mb-3 overflow-y-hidden"
                style={{
                  paddingLeft: `${itemPx}px`,
                  paddingRight: `${itemPx}px`,
                }}
              >
                {script.lines.map((line: any, index: any) => {
                  return (
                    <span
                      key={index}
                      className="group-hover/container:text-primary/85 block font-bold text-placeholder leading-[33px] transition-colors duration-200 ease-in-out"
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {line}
                    </span>
                  );
                })}

                <div className="absolute opacity-0 group-hover/container:opacity-100 flex items-center gap-2 right-[18px] bottom-3 p-2 rounded-full bg-background transition-opacity duration-300 ease-in-out">
                  <ClockIcon className="h-3 text-secondary" />
                  <span className="font-semibold text-xs text-primary">
                    {formatTimestamp(script.duration)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1 pb-4 pt-3.5 pl-[18px] w-full bg-background rounded-b-[10px] transition-colors duration-200 ease-in-out group-hover/container:bg-hover">
                <div className="flex justify-between items-center">
                  <div className="flex justify-start items-center gap-2 min-w-0">
                    <span className="text-primary font-bold text-sm truncate">
                      {script.title}
                    </span>
                    <div className="flex items-center justify-start gap-1.5">
                      <CollaboratorsIcon className="h-2.5 text-placeholder" />
                      {script.isFavorite && (
                        <IsFavoriteIcon className="h-3 text-placeholder" />
                      )}
                    </div>
                  </div>
                  <span className="group/icon px-3.5 cursor-pointer">
                    <MoreIcon className="group-hover/icon:text-primary h-3 text-inactive" />
                  </span>
                </div>
                <span className="font-semibold text-[13px] text-secondary">
                  Opened 2 hours ago
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
}
