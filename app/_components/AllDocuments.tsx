"use client";

import React, { useState } from "react";
import ListView from "./ListView";
import GridView from "./GridView";
import { GridViewIcon, ListViewIcon } from "../_assets/icons";
import { useRealtimeData } from "../_contexts/RealtimeDataContext";

export default function AllDocuments() {
  // const { recentlyModified } = useRecentScripts();
  const { scripts } = useRealtimeData();

  const [displayType, setDisplayType] = useState<any>("grid");

  return (
    <div className="grow px-10 py-6">
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

      <ListView displayType={displayType} scripts={scripts} />
      <GridView displayType={displayType} scripts={scripts} />
    </div>
  );
}
