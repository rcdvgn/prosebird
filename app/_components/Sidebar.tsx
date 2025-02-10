"use client";

import { useState, useEffect } from "react";
import {
  AddIcon,
  CloseIcon,
  DashboardIcon,
  EndedIcon,
  HelpIcon,
  InboxIcon,
  LogoIcon,
  MoreIcon,
  PresentationIcon,
  ScriptIcon,
  SearchIcon,
  SettingsIcon,
  ShrinkIcon,
  SideBarExpandIcon,
} from "../_assets/icons";

import { useRouter } from "next/navigation";

import { useAuth } from "../_contexts/AuthContext";

import { useModal } from "../_contexts/ModalContext";
import Settings from "./modals/Settings";
import Input3 from "./ui/Input3";
import { useRealtimeData } from "../_contexts/RealtimeDataContext";
import Scripts from "./sidebar/Scripts";
import Presentations from "./sidebar/Presentations";
import Inbox from "./sidebar/Inbox";

export default function Sidebar(fileId: any) {
  const { openModal, currentModal } = useModal();
  const { user, logout } = useAuth();
  const { scripts, presentations, notifications, people } = useRealtimeData();

  const router = useRouter();

  const [currentTab, setCurrentTab] = useState<any>(null);

  const sidebarTabs: any = {
    scripts: {
      icon: <ScriptIcon className="h-5" />,
      name: "Scripts",
    },
    presentations: {
      icon: <PresentationIcon className="w-5" />,
      name: "Presentations",
    },
    inbox: {
      icon: <InboxIcon className="h-5" />,
      name: "Inbox",
    },
  };

  const handleSettings = () => {
    openModal({ content: <Settings />, name: "settings" });
  };

  return (
    <div className="flex shrink-0">
      <div className="flex flex-col items-center justify-start w-[80px]">
        <div className="h-[68px] w-full grid place-items-center">
          <span
            className="cursor-pointer"
            onClick={() => router.push(`/files`)}
          >
            <LogoIcon className="h-5" />
          </span>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <div className="flex flex-col items-center justify-start gap-4 w-full px-[18px] py-2.5">
            {Object.entries(sidebarTabs).map(
              ([tabName, tabValues]: any, index: any) => {
                return (
                  <div
                    key={index}
                    onClick={() =>
                      currentTab === tabName
                        ? setCurrentTab(null)
                        : setCurrentTab(tabName)
                    }
                    className={`h-[44px] aspect-square grid place-items-center transition-all ease-in-out duration-150 rounded-xl cursor-pointer ${
                      currentTab === tabName
                        ? "text-brand bg-brand/15 hover:bg-brand/20"
                        : "text-placeholder hover:text-primary hover:bg-hover"
                    }`}
                  >
                    {tabValues.icon}
                  </div>
                );
              }
            )}
          </div>

          <div className="w-7 h-[1px] rounded-full bg-border"></div>

          <div className="flex flex-col items-center justify-start gap-4 w-full px-[18px] py-2.5">
            <div className="h-[44px] aspect-square grid place-items-center transition-all ease-in-out duration-150 rounded-xl cursor-pointer text-placeholder hover:text-primary hover:bg-hover">
              <HelpIcon className="h-5" />
            </div>

            <div
              onClick={handleSettings}
              className={`h-[44px] aspect-square grid place-items-center transition-all ease-in-out duration-150 rounded-xl cursor-pointer hover:bg-hover ${
                currentModal?.name === "settings"
                  ? "text-primary"
                  : "text-placeholder hover:text-primary"
              }`}
            >
              <SettingsIcon className="h-5" />
            </div>
          </div>
        </div>
      </div>

      {currentTab && (
        <div
          className={`w-[300px] pl-2 pr-4 ${currentTab ? "block" : "hidden"}`}
        >
          <div className="h-[68px] w-full flex justify-between items-center">
            <Input3 />

            <span
              onClick={() => setCurrentTab(null)}
              className="group button-icon !bg-transparent text-placeholder"
            >
              <ShrinkIcon className="h-3 transition-transform duration-200 ease-in-out group-hover:-translate-x-1" />
            </span>
          </div>

          <div className="">
            <div className="pb-4 flex items-center justify-between">
              <span className="text-base font-bold text-primary">
                {sidebarTabs[currentTab]?.name}
              </span>
            </div>

            <div
              className={
                sidebarTabs[currentTab]?.name === "Scripts" ? "block" : "hidden"
              }
            >
              <Scripts scripts={scripts} people={people} />
            </div>

            <div
              className={
                sidebarTabs[currentTab]?.name === "Presentations"
                  ? "block"
                  : "hidden"
              }
            >
              <Presentations presentations={presentations} people={people} />
            </div>

            <div
              className={
                sidebarTabs[currentTab]?.name === "Inbox" ? "block" : "hidden"
              }
            >
              <Inbox notifications={notifications} people={people} />{" "}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
