"use client";
import { motion } from "framer-motion";

import { useState, useEffect } from "react";
import {
  AddIcon,
  CloseIcon,
  DashboardIcon,
  XIcon,
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
  LogoutIcon,
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
import TooltipWrapper from "./wrappers/TooltipWrapper";
import capitalizeFirstLetter from "../_utils/capitalizeFirstLetter";
import DropdownWrapper from "./wrappers/DropdownWrapper";
import ProfilePicture from "./ProfilePicture";

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
    <div className="flex flex-col shrink-0 pb-2">
      <div className="flex grow">
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
                    <div key={index}>
                      <TooltipWrapper
                        className="!delay-0"
                        position="right"
                        data={{
                          text: capitalizeFirstLetter(tabName),
                        }}
                      >
                        <div
                          onClick={() =>
                            currentTab === tabName
                              ? setCurrentTab(null)
                              : setCurrentTab(tabName)
                          }
                          className={`nav-tabs ${
                            currentTab === tabName
                              ? "text-brand bg-brand/15 hover:bg-brand/20"
                              : "text-placeholder hover:text-primary hover:bg-hover"
                          }`}
                        >
                          {tabValues.icon}
                        </div>
                      </TooltipWrapper>
                    </div>
                  );
                }
              )}
            </div>

            <div className="w-7 h-[1px] rounded-full bg-border"></div>

            <div className="flex flex-col items-center justify-start gap-4 w-full px-[18px] py-2.5">
              <TooltipWrapper
                className="!delay-0"
                position="right"
                data={{
                  text: "Help",
                }}
              >
                <div className="nav-tabs text-placeholder hover:text-primary hover:bg-hover">
                  <HelpIcon className="h-5" />
                </div>
              </TooltipWrapper>

              <TooltipWrapper
                className="!delay-0"
                position="right"
                data={{
                  text: "Settings",
                }}
              >
                <div
                  onClick={handleSettings}
                  className={`nav-tabs hover:bg-hover ${
                    currentModal?.name === "settings"
                      ? "text-primary"
                      : "text-placeholder hover:text-primary"
                  }`}
                >
                  <SettingsIcon className="h-5" />
                </div>
              </TooltipWrapper>
            </div>
          </div>
        </div>

        <div
          className={`overflow-hidden relative transition-all duration-300 ease-in-out ${
            currentTab ? "w-[300px]" : "w-0"
          }`}
        >
          <div
            className={`absolute w-[300px] pl-2 pr-4 transition-all duration-300 ease-in-out top-0 ${
              currentTab
                ? "right-0 opacity-100"
                : "right-full pointer-events-none opacity-0"
            }`}
          >
            <div className="h-[68px] w-full flex justify-between items-center">
              <Input3 />
              <TooltipWrapper
                position="bottom"
                data={{
                  text: "Shrink sidebar",
                }}
              >
                <span
                  onClick={() => setCurrentTab(null)}
                  className="group button-icon !bg-transparent text-placeholder"
                >
                  <ShrinkIcon className="h-3 transition-transform duration-200 ease-in-out group-hover:-translate-x-1" />
                </span>
              </TooltipWrapper>
            </div>

            <div className="">
              <div className="pb-4 flex items-center justify-between">
                <span className="text-base font-bold text-primary">
                  {sidebarTabs[currentTab]?.name}
                </span>
              </div>

              <div
                className={
                  !currentTab || sidebarTabs[currentTab]?.name === "Scripts"
                    ? "block"
                    : "hidden"
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
        </div>
      </div>

      {/* flex justify-center w-[80px] */}

      <div className="my-5">
        <div
          className={`transition-all duration-300 ease-in-out flex flex-col gap-4 py-3.5 px-[18px] rounded-[10px] ring-1  ${
            currentTab
              ? "mx-[18px] bg-foreground ring-stroke"
              : "bg-transparent ring-transparent items-center"
          }`}
        >
          <div className="flex justify-between items-center">
            <DropdownWrapper
              isActive={currentTab ? false : true}
              position="top"
              options={[
                { text: "Settings", onClick: handleSettings },
                { text: "Log out", onClick: logout },
                {
                  text: "Get desktop app",
                  onClick: () => console.log("You clicked 'Get desktop app'"),
                },
              ]}
            >
              <ProfilePicture
                profilePictureURL={user?.profilePictureURL}
                className={`transition-all duration-300 ease-in-out ${
                  !currentTab ? "h-9" : "h-7"
                } cursor-pointer`}
                firstName={user?.firstName}
                lastName={user?.lastName}
              />
            </DropdownWrapper>

            {currentTab && (
              <div className="flex items-center gap-5">
                <span className="font-bold text-sm text-brand hover:underline cursor-pointer">
                  Get pro
                </span>
                <span
                  onClick={handleSettings}
                  className="group p-1 text-inactive hover:text-primary cursor-pointer"
                >
                  <SettingsIcon className="h-[18px] group-hover:scale-105" />
                </span>
                <span
                  onClick={logout}
                  className="group p-1 text-inactive hover:text-primary cursor-pointer"
                >
                  <LogoutIcon className="h-[18px] group-hover:scale-105" />
                </span>
              </div>
            )}
          </div>

          {currentTab && (
            <div className="">
              <span className="block font-semibold text-primary text-[15px] mb-[2px]">
                {user?.firstName + " " + user?.lastName}
              </span>
              <span className="block font-medium text-secondary text-sm">
                ricardorpvigliano@gmail.com
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
