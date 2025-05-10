"use client";
import { motion } from "framer-motion";

import { useState, useEffect } from "react";
import {
  AddIcon,
  CloseIcon,
  DashboardIcon,
  ClearIcon,
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
import Inbox from "./sidebar/Inbox";
import TooltipWrapper from "./wrappers/TooltipWrapper";
import capitalizeFirstLetter from "../_utils/capitalizeFirstLetter";
import DropdownWrapper from "./wrappers/DropdownWrapper";
import ProfilePicture from "./ProfilePicture";
import { clearUnseenNotifications } from "../_services/client";
import Presentations from "./sidebar/presentations";

const findUnseenNotifications = (notifications: any, onlyIds: any) => {
  let newUnseenNotifications = notifications
    .map((noti: any) => {
      if (noti.unseen) {
        return onlyIds ? noti.id : noti;
      }
      return null;
    })
    .filter((noti: any) => noti !== null && noti !== undefined);

  return newUnseenNotifications;
};

const NotificationNotifier = ({ notifications, iconSelected }: any) => {
  const [unseenNotifications, setUnseenNotifications] = useState<any>([]);

  useEffect(() => {
    if (!notifications) return;

    const newUnseenNotifications = findUnseenNotifications(
      notifications,
      false
    );

    setUnseenNotifications(newUnseenNotifications);
  }, [notifications]);

  return unseenNotifications.length ? (
    <div
      className={`absolute aspect-square bg-brand rounded-full ring-2 grid place-items-center h-4 -top-2 -right-2
        ${
          iconSelected
            ? "ring-transparent"
            : "ring-background group-hover:ring-hover-solid"
        }`}
    >
      <span className="text-primary text-[11px] font-semibold -translate-y-[1px]">
        {unseenNotifications.length}
      </span>
    </div>
  ) : null;
};

const LivePresentationNotifier = ({ presentations, iconSelected }: any) => {
  const [livePresentations, setLivePresentations] = useState<any>([]);

  useEffect(() => {
    if (!presentations) return;

    const newLivePresentations = presentations.filter(
      (presentation: any) => presentation.status === "active"
    );

    setLivePresentations(newLivePresentations);
  }, [presentations]);

  return livePresentations.length ? (
    <div
      className={`absolute aspect-square bg-danger-red rounded-full ring-2 grid place-items-center h-1.5 -top-1 -right-1
      ${
        iconSelected
          ? "ring-transparent"
          : "ring-background group-hover:ring-hover-solid"
      }`}
    ></div>
  ) : null;
};

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

  useEffect(() => {
    if (currentTab !== "inbox") return;

    const handleUnseenNotifications = async (unseenNotificationIds: any) => {
      await clearUnseenNotifications(unseenNotificationIds);
    };

    const newUnseenNotificationIds = findUnseenNotifications(
      notifications,
      true
    );
    handleUnseenNotifications(newUnseenNotificationIds);
  }, [currentTab]);

  return (
    <div className="flex flex-col shrink-0 pb-2">
      <div className="flex grow">
        <div className="flex flex-col items-center justify-start w-[80px]">
          <div className="h-16 w-full grid place-items-center">
            <span
              className="cursor-pointer"
              onClick={() => router.push(`/files`)}
            >
              <LogoIcon className="h-5 text-primary" />
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
                              ? "group text-brand bg-brand/15 hover:bg-brand/20"
                              : "text-placeholder hover:text-primary hover:bg-hover-solid"
                          }`}
                        >
                          <span className="relative">
                            {tabValues.icon}
                            {tabName === "presentations" && (
                              <LivePresentationNotifier
                                presentations={presentations}
                                iconSelected={currentTab === tabName}
                              />
                            )}
                            {tabName === "inbox" && (
                              <NotificationNotifier
                                notifications={notifications}
                                iconSelected={currentTab === tabName}
                              />
                            )}
                          </span>
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
            <div className="h-16 w-full flex justify-between items-center">
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
                <Scripts scripts={scripts} people={people} user={user} />
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
          className={`transition-all duration-300 ease-in-out flex flex-col gap-4 px-[18px] rounded-[10px] ring-1  ${
            currentTab
              ? "py-3.5 mx-[18px] bg-foreground ring-stroke"
              : "bg-transparent ring-transparent items-center"
          }`}
        >
          <div className="flex justify-between items-center">
            <DropdownWrapper
              isActive={currentTab ? false : true}
              position="top"
              optionGroups={[
                [
                  { text: "Settings", onClick: handleSettings },
                  { text: "Log out", onClick: logout },
                  {
                    text: "Get desktop app",
                    onClick: () => console.log("You clicked 'Get desktop app'"),
                  },
                ],
              ]}
            >
              <ProfilePicture
                profilePictureURL={user?.profilePictureURL}
                className={`transition-all duration-300 ease-in-out ${
                  !currentTab ? "h-9" : "h-7"
                } cursor-pointer`}
                displayName={user?.displayName}
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
                {user?.displayName}
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
