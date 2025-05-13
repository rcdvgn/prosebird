"use client";
import React, { useState } from "react";
import { motion } from "framer-motion"; // Add this at the top
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
import { useModal } from "../_contexts/ModalContext";
import Settings from "./modals/Settings";

export default function Sidebar() {
  const [expanded, setExpanded] = useState<any>(true);
  const { openModal } = useModal();

  const [currentPage, setCurrentPage] = useState<any>(null);

  const handleSettings = () => {
    openModal({ content: <Settings />, name: "settings" });
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: expanded ? 300 : 80 }} // exact px to match your Tailwind
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="@container shrink-0 flex flex-col items-center justify-between px-3 pb-5"
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
            name={"Expand"}
            onClick={() => setExpanded((curr: any) => !curr)}
            icon={
              <ExpandSideBarIcon
                className={`h-full @[80px]:h-4 text-tertiary group-hover:text-primary`}
                filled={currentPage === "Expand" ? true : false}
              />
            }
            isCurrent={currentPage === "Expand"}
            className="@[80px]:hidden"
          />

          <Page
            name={"Home"}
            onClick={() => {
              console.log("You clicked Home");
            }}
            icon={
              <HomeSideBarIcon
                className={`h-full @[80px]:h-4 text-tertiary group-hover:text-primary`}
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
                className={`h-full @[80px]:h-4 text-tertiary group-hover:text-primary`}
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
                className={`h-full @[80px]:h-4 text-tertiary group-hover:text-primary`}
                filled={currentPage === "Help" ? true : false}
              />
            }
            isCurrent={currentPage === "Help"}
          />

          <Page
            name={"Settings"}
            onClick={handleSettings}
            icon={
              <SettingsSideBarIcon
                className={`h-full @[80px]:h-4 text-tertiary group-hover:text-primary`}
                filled={currentPage === "Settings" ? true : false}
              />
            }
            isCurrent={currentPage === "Settings"}
          />

          <div className="mt-1 w-10 h-10 @[80px]:w-full @[80px]:h-auto rounded-xl @[80px]:bg-brand/10 @[80px]:border-[1px] @[80px]:border-brand/15 @[80px]:px-4 @[80px]:py-2.5 hover:bg-brand/10 cursor-pointer @[80px]:cursor-auto">
            <div className="@[80px]:mb-3 h-full @[80px]:h-auto">
              <div className="flex items-center justify-center @[80px]:justify-start gap-1.5 h-full @[80px]:h-auto">
                <ProIcon className="h-5 @[80px]:h-[18px] text-brand" />
                <span className="hidden @[80px]:inline text-brand text-sm font-bold">
                  Your free trial ends in 2 days
                </span>
              </div>
              <span className="hidden @[80px]:inline text-tertiary text-xs font-semibold mt-1 hover:underline cursor-pointer">
                See plans
              </span>
            </div>
            <div className="hidden @[80px]:block relative overflow-hidden h-[3px] rounded-full w-full bg-brand/20">
              <div className="absolute h-full w-full right-[75%] top-0 bg-brand"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const Page = ({ icon, name, isCurrent, onClick, className = "" }: any) => {
  return (
    <div
      onClick={onClick}
      className={`${className} group cursor-pointer flex items-center justify-center @[80px]:justify-start gap-2.5 rounded-xl @[80px]:pl-3.5 @[80px]:pr-4 h-10 @[80px]:w-full w-10 ${
        isCurrent
          ? "bg-selected text-primary"
          : "text-inactive hover:!text-primary hover:bg-hover"
      }`}
    >
      <span className="grid h-5 w-5 place-items-center">{icon}</span>
      <span className="hidden @[80px]:inline font-bold text-sm truncate">
        {name}
      </span>
    </div>
  );
};

const Hr = () => {
  return <div className="bg-stroke h-[1px] rounded-full"></div>;
};
