"use client";
import React, { useState } from "react";
import { ProseBird } from "../_assets/logos";
import {
  ExpandSideBarIcon,
  HelpSideBarIcon,
  HomeSideBarIcon,
  NewScriptIcon,
  ProIcon,
  SettingsSideBarIcon,
  SideBarSearchIcon,
} from "../_assets/icons";
import Scripts from "./sidebar/Scripts";

export default function Sidebar() {
  const [expanded, setExpanded] = useState<any>(true);

  const [currentPage, setCurrentPage] = useState<any>(null);

  return (
    <div
      className={`@container shrink-0 flex flex-col items-center justify-between px-3 pb-5 ${
        expanded ? "w-[300px]" : "w-20"
      }`}
    >
      <div className="w-full shrink-0 h-16 flex items-center justify-center @[80px]:justify-between @[80px]:pl-4 [80px]:pr-2">
        <ProseBird squared={!expanded} className="h-5 text-primary shrink-0" />

        {expanded && (
          <span
            onClick={() => setExpanded((curr: any) => !curr)}
            className="button-icon h-10 w-10 rounded-xl !bg-transparent"
          >
            <ExpandSideBarIcon className="h-[18px]" retract={expanded} />
          </span>
        )}
      </div>

      <div className="w-full flex flex-col gap-4 min-h-0">
        <div className="w-full flex flex-col items-center gap-1">
          <Page
            name={"Home"}
            onClick={() => {
              console.log("You clicked Home");
            }}
            icon={
              <HomeSideBarIcon
                className={`h-full @[80px]:h-4 text-tertiary`}
                filled={currentPage === "Home" ? true : false}
              />
            }
            isCurrent={currentPage === "Home"}
          />

          <Page
            name={"Search"}
            onClick={() => {
              console.log("You clicked Search");
            }}
            icon={
              <SideBarSearchIcon
                className={`h-full @[80px]:h-4 text-tertiary`}
                filled={currentPage === "Search" ? true : false}
              />
            }
            isCurrent={currentPage === "Search"}
          />

          <button className="@[80px]:w-full w-10 btn-1-lg !text-sm gap-2.5 p-0 @[80px]:p-auto mt-1">
            <NewScriptIcon className="h-[18px] @[80px]:h-4 shrink-0" />
            <span className="@[80px]:inline hidden">New Script</span>
          </button>
        </div>

        <Hr />

        <Scripts />
      </div>

      <div className="w-full flex flex-col gap-4 shrink-0">
        <Hr />

        <div className="w-full flex flex-col items-center gap-1">
          <Page
            name={"Help"}
            onClick={() => {
              console.log("You clicked Help");
            }}
            icon={
              <HelpSideBarIcon
                className={`h-full @[80px]:h-4 text-tertiary`}
                filled={currentPage === "Help" ? true : false}
              />
            }
            isCurrent={currentPage === "Help"}
          />

          <Page
            name={"Settings"}
            onClick={() => {
              console.log("You clicked Settings");
            }}
            icon={
              <SettingsSideBarIcon
                className={`h-full @[80px]:h-4 text-tertiary`}
                filled={currentPage === "Settings" ? true : false}
              />
            }
            isCurrent={currentPage === "Settings"}
          />

          <div className="rounded-[10px] bg-brand/10 border-[1px] border-brand/15 px-4 py-2.5">
            <div className="mb-3">
              <div className="flex items-center gap-1.5">
                <ProIcon className="h-[18px] text-brand" />
                <span className="text-brand text-sm font-bold">
                  Your free trial ends in 2 days
                </span>
              </div>
              <span className="text-tertiary text-xs font-semibold mt-1 hover:underline cursor-pointer">
                See plans
              </span>
            </div>
            <div className="relative overflow-hidden h-[3px] rounded-full w-full bg-brand/20">
              <div className="absolute h-full w-full right-[75%] top-0 bg-brand"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Page = ({ icon, name, isCurrent, onClick }: any) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer flex items-center justify-center @[80px]:justify-start gap-2.5 rounded-xl @[80px]:pl-3.5 @[80px]:pr-4 h-10 @[80px]:w-full w-10 ${
        isCurrent
          ? "bg-selected text-primary"
          : "text-inactive hover:!text-primary hover:bg-hover"
      }`}
    >
      <span className="grid h-5 w-5 place-items-center">{icon}</span>
      <span className="hidden @[80px]:inline font-semibold text-sm truncate">
        {name}
      </span>
    </div>
  );
};

const Hr = () => {
  return <div className="bg-stroke h-[1px] rounded-full"></div>;
};
