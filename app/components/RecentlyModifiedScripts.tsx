import React from "react";

import { ScriptIcon, MoreIcon, UsersIcon } from "../assets/icons";

export default function RecentlyModifiedScripts() {
  return (
    <div className="">
      <div className="">
        <span className="files-section-title">Recently modified</span>
      </div>
      <div className="flex gap-8 mt-7">
        <div className="cursor-pointer hover:bg-foreground-primary w-[400px] border-[1px] flex gap-4 items-start border-border rounded-[10px] p-4">
          <div className="icon-container shrink-0">
            <ScriptIcon className="text-text-primary h-4" />
          </div>
          <div className="flex flex-col grow min-w-0 h-full justify-between">
            <span className="text-text-primary text-sm font-semibold truncate">
              Revolutionizing Quantitative Computing with AI
            </span>
            <div className="flex gap-2 items-center">
              <UsersIcon className="text-text-primary w-fit h-[12px]" />
              <span className="text-text-secondary font-medium text-[13px]">
                Sep 19, 2024
              </span>
            </div>
          </div>
          <span className="group w-6 p-[4px] grid place-items-center">
            <MoreIcon className="group-hover:text-text-primary text-text-secondary w-fit h-full" />
          </span>
        </div>
      </div>
    </div>
  );
}
