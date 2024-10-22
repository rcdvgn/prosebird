"use client";

import React from "react";
import { MoreIcon, ScriptIcon } from "../_assets/icons";
import { useRecentScripts } from "@/app/_contexts/RecentScriptsContext";
import { lastModifiedFormatter } from "../_utils/lastModifiedFormater";

export default function AllScripts() {
  const { recentlyModified } = useRecentScripts();

  return (
    <div className="">
      <div className="">
        <span className="files-section-title">All scripts</span>
      </div>
      <div className="flex gap-4 mt-7">
        {/* <div className=""></div> controls */}
        <div className="flex flex-col w-full">
          <div className="mb-1 flex gap-4 items-center bg-foreground-secondary py-2 px-3 rounded-[10px]">
            <div className="script-select"></div>
            <span className="text-text-secondary font-semibold text-[13px]">
              Name
            </span>
            <div className="flex gap-4 items-center h-full ml-auto">
              <span className="text-text-secondary font-semibold text-[13px] w-80">
                Created by
              </span>
              <span className="text-text-secondary font-semibold text-[13px] w-32">
                Last modified
              </span>
              <div className="btn-3 invisible">
                <MoreIcon className="" />
              </div>
            </div>
          </div>

          {recentlyModified &&
            recentlyModified.map((item: any, index: any) => {
              return (
                <div
                  key={item.id}
                  className="group/main h-[68px] border-b-[1px] border-border px-3 flex gap-4 items-center justify-start"
                >
                  <div className="script-select"></div>
                  <div className="flex gap-4 items-center grow min-w-0">
                    <div className="icon-container">
                      <ScriptIcon className="text-text-primary" />
                    </div>
                    <span className="text-text-primary font-semibold text-sm truncate hover:underline cursor-pointer">
                      {item.title}
                    </span>
                  </div>

                  <div className="flex gap-4 items-center h-full ml-auto">
                    <div className="flex w-80 items-center gap-[10px]">
                      <div
                        style={{
                          backgroundImage: `url("/pfps/profile1.png")`,
                        }}
                        className="h-9 aspect-square rounded-full bg-cover bg-center flex-shrink-0"
                      ></div>
                      <div className="h-full flex flex-col gap-1 grow min-w-0">
                        <span className="text-text-primary font-semibold text-sm mb-[-3px] truncate">
                          You
                        </span>
                        <span className="text-text-secondary font-medium text-[13px] truncate">
                          {item.createdBy.email}
                        </span>
                      </div>
                    </div>
                    <span className="text-text-secondary font-semibold text-[13px] w-32">
                      {lastModifiedFormatter(item.lastModified)}
                    </span>
                    <div className="btn-3 group-hover/main:visible invisible">
                      <MoreIcon className="" />
                    </div>
                    {/* <div className="group/nested w-8 rounded-lg cursor-pointer aspect-square grid place-items-center hover:bg-foreground-hover">
                <MoreIcon className="text-text-secondary h-fit w-[3px] group-hover/main:visible invisible group-hover/nested:text-text-primary" />
              </div> */}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
