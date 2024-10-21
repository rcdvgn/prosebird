import React from "react";

import { ScriptIcon, MoreIcon, UsersIcon } from "../_assets/icons";

export default function RecentlyModifiedScripts() {
  return (
    <div className="">
      <div className="">
        <span className="files-section-title">Recently modified</span>
      </div>
      <div className="flex gap-8 mt-7">
        <div className="group/wrapper w-[400px] border-[1px] flex gap-4 items-center border-border rounded-[10px] p-4">
          <div className="icon-container shrink-0">
            <ScriptIcon className="text-text-primary h-4 z-10" />
          </div>
          <div className="flex flex-col grow min-w-0 h-full gap-2 z-10">
            <span className="text-text-primary text-sm font-semibold truncate cursor-pointer hover:underline">
              Revolutionizing Quantitative Computing with AI
            </span>
            <div className="flex gap-2 items-center">
              <UsersIcon className="text-text-primary w-fit h-[12px]" />
              <span className="text-text-secondary font-medium text-[13px]">
                Sep 19, 2024
              </span>
            </div>
          </div>
          <div className="h-full">
            <span className="group/more w-[30px] aspect-square p-[4px] grid place-items-center hover:bg-foreground-hover z-10 rounded-lg cursor-pointer">
              <MoreIcon className="group-hover/more:text-text-primary text-text-secondary" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
