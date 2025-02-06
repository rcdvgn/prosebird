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

import { getPeople, getUserScripts } from "@/app/_services/client";

import { useAuth } from "../_contexts/AuthContext";

import { useRecentScripts } from "@/app/_contexts/RecentScriptsContext";
import { useModal } from "../_contexts/ModalContext";
import Settings from "./modals/Settings";
import Input3 from "./ui/Input3";
import { useScriptEditor } from "../_contexts/ScriptEditorContext";
import { useRealtimeData } from "../_contexts/RealtimeDataContext";
import ProfilePicture from "./ProfilePicture";
import { notificationTypes } from "../_lib/notificationTypes";

const Inbox = ({ notifications, people }: any) => {
  const router = useRouter();

  return (
    <div>
      <div className="w-full h-8 flex items-center justify-start gap-2 mb-5">
        <div className="bg-battleground rounded-full h-full aspect-square text-inactive grid place-items-center hover:bg-hover hover:text-primary cursor-pointer">
          <CloseIcon className="h-2.5" />
        </div>

        <div className="bg-brand rounded-full h-[30px] flex justify-center items-center px-3.5 cursor-pointer text-primary">
          <span className="font-bold text-[13px]">Active</span>
        </div>

        <div className="bg-battleground rounded-full h-full flex justify-center items-center px-3.5 cursor-pointer text-inactive hover:text-primary hover:bg-hover">
          <span className="font-bold text-[13px]">Solo</span>
        </div>
      </div>

      <span className="block font-semibold text-xs text-secondary mb-4">
        Today
      </span>

      <div className="flex flex-col gap-4">
        {notifications &&
          people &&
          notifications.map((notification: any, index: any) => {
            return (
              <div key={index} className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <ProfilePicture
                    profilePictureURL={
                      people[notification.data.presentationHost]
                        ?.profilePictureURL
                    }
                    className="h-8"
                  />

                  <div className="grow leading-4">
                    <span className="font-bold text-[13px] text-primary hover:underline cursor-pointer">
                      {people[notification.data.presentationHost].firstName +
                        " " +
                        people[notification.data.presentationHost].lastName}
                    </span>
                    <span className="font-medium text-xs text-primary">
                      {" " + notificationTypes[notification.type].text[0] + " "}
                    </span>
                    <span className="font-medium text-xs text-secondary">
                      1h
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    router.push(`/p/${notification.data.presentationCode}`)
                  }
                  className="hover:underline border-none outline-none font-bold text-[13px] text-brand px-2 py-1"
                >
                  Join
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

const Scripts = ({ scripts }: any) => {
  const { user } = useAuth();
  const { script } = useScriptEditor();

  // const [scriptList, setScriptList] = useState<any>(null);

  const router = useRouter();

  // useEffect(() => {
  //   const handleGetAllScripts = async (userId: any) => {
  //     const newScriptList = await getUserScripts(userId);

  //     setScriptList(newScriptList);
  //   };
  //   if (user) {
  //     handleGetAllScripts(user.id);
  //   }
  // }, [user]);

  return (
    <div>
      <span className="block font-semibold text-xs text-secondary mb-4">
        Today
      </span>

      <div className="flex flex-col">
        {scripts &&
          scripts.map((item: any, index: any) => {
            return (
              <div
                key={index}
                onClick={() => router.push(`/file/${item.id}`)}
                className={`group h-11 w-full rounded-[10px] pl-[18px] pr-1 flex items-center justify-between cursor-pointer ${
                  script?.id === item.id
                    ? "bg-battleground text-primary"
                    : "text-inactive hover:text-primary hover:bg-hover"
                }`}
              >
                <div className="flex justify-start items-center grow min-w-0 gap-3">
                  <ScriptIcon className="h-4 shrink-0" />
                  <span className="block h-[18px] font-semibold text-[13px] truncate">
                    {item?.title}
                  </span>
                </div>

                <span
                  className={`button-icon !bg-transparent ${
                    script?.id === item.id
                      ? "text-primary"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <MoreIcon className="h-3" />
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

const Presentations = ({ presentations }: any) => {
  return (
    <div>
      <span className="block font-semibold text-xs text-secondary mb-4">
        Today
      </span>

      <div className="flex flex-col">
        {presentations &&
          presentations.map((item: any, index: any) => {
            return (
              <div
                key={index}
                className="group p-2.5 w-full rounded-[10px] flex items-center justify-start gap-2 cursor-pointer hover:bg-battleground"
              >
                <div className="flex items-center h-8">
                  <div
                    style={{
                      backgroundImage: `url("/pfps/profile1.png")`,
                    }}
                    className="ring-2 ring-background group-hover:ring-battleground h-full aspect-square rounded-full bg-cover bg-center flex-shrink-0"
                  ></div>

                  {Object.keys(item.participants).filter(
                    (participantId: any) =>
                      item.participants[participantId].role !== "author"
                  ).length > 0 && (
                    <div className="ring-2 ring-background group-hover:ring-battleground -ml-2 h-full aspect-square grid place-items-center rounded-full bg-selected">
                      <span className="text-secondary font-bold text-[13px]">
                        +
                        {
                          Object.keys(item.participants).filter(
                            (participantId: any) =>
                              item.participants[participantId].role !== "author"
                          ).length
                        }
                      </span>
                    </div>
                  )}
                </div>

                <div className="grow min-w-0">
                  <div className="w-full flex items-center gap-2">
                    <span className="font-bold text-[13px] text-primary truncate">
                      {item.title}
                    </span>

                    {item.status === "active" ? (
                      <div className="bg-live-red/15 rounded-full py-1 px-2 flex items-center gap-1 text-live-red">
                        <div className="bg-live-red rounded-full h-[5px] aspect-square"></div>
                        <span className="font-bold text-[11px]">
                          {
                            Object.values(item.participants).filter(
                              (participant: any) => participant.isConnected
                            ).length
                          }
                        </span>
                      </div>
                    ) : (
                      <div className="bg-placeholder/15 rounded-full py-1 px-2 flex items-center gap-1 text-placeholder">
                        <EndedIcon className="h-1.5" />
                        <span className="font-bold text-[11px]">Ended</span>
                      </div>
                    )}
                  </div>
                  <span className="block font-semibold text-xs text-secondary">
                    just now
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default function Sidebar(fileId: any) {
  const { openModal, currentModal } = useModal();
  const { user, logout } = useAuth();
  // const { recentlyModified } = useRecentScripts();
  const { scripts, presentations, notifications, people } = useRealtimeData();

  const router = useRouter();

  // const [isSearchOn, setIsSearchOn] = useState<any>(false);

  const [currentTab, setCurrentTab] = useState<any>(null);

  const sidebarTabs: any = {
    scripts: {
      content: <Scripts scripts={scripts} />,
      icon: <ScriptIcon className="h-5" />,
      name: "Scripts",
    },
    presentations: {
      content: <Presentations presentations={presentations} />,
      icon: <PresentationIcon className="w-5" />,
      name: "Presentations",
    },
    inbox: {
      content: <Inbox notifications={notifications} people={people} />,
      icon: <InboxIcon className="h-5" />,
      name: "Inbox",
    },
  };

  // const [scriptCount, setScriptCount] = useState(1);

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
                    className={`h-[44px] aspect-square grid place-items-center transition-bg ease-in-out duration-100 rounded-xl cursor-pointer ${
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
            <div className="h-[44px] aspect-square grid place-items-center transition-bg ease-in-out duration-100 rounded-xl cursor-pointer text-placeholder hover:text-primary hover:bg-hover">
              <HelpIcon className="h-5" />
            </div>

            <div
              onClick={handleSettings}
              className={`h-[44px] aspect-square grid place-items-center transition-bg ease-in-out duration-100 rounded-xl cursor-pointer hover:bg-hover ${
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
        <div className="w-[300px] pl-2 pr-4">
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

            {sidebarTabs[currentTab]?.content}
          </div>
        </div>
      )}

      {/* <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Logout
      </button> */}
    </div>
  );
}

{
  /* <div className="flex items-center justify-between h-[55px]">
        <span onClick={handleSettings} className="ml-[10px]">
          <Logo />
        </span>
        <span className="w-[30px] grid place-items-center cursor-pointer">
          <SideBarExpandIcon className="fill-text-primary" />
        </span>
      </div>
      <div className="">
        <div
          onClick={() => router.push(`/files`)}
          className="cursor-pointer flex items-center justify-start rounded-lg hover:bg-hover select-none h-[42px]"
        >
          <span className="ml-[10px] font-bold text-sm text-primary">Home</span>
        </div>
        <input type="text" className="hidden" />
      </div>
      <div className="">
        
        <div className="py-3 px-[18px]">
          <span className="text-xs font-semibold text-secondary">Today</span>
        </div>
        <div className="flex flex-col">
          {recentlyModified &&
            recentlyModified.map((item: any, index: any) => {
              return (
                <div
                  onClick={() => router.push(`/file/${item.id}`)}
                  key={index}
                  className={`${
                    script
                      ? item.id === fileId?.fileId
                        ? "bg-selected"
                        : "hover:bg-hover"
                      : ""
                  } select-none cursor-pointer rounded-[10px] flex items-center justify-start gap-3 pl-[18px] pr-1 h-[40px] group`}
                >
                  <span className="w-[14px] aspect-square grid place-items-center shrink-0">
                    <ScriptIcon className="text-primary h-4" />
                  </span>
                  <span className="font-semibold text-[13px] text-primary whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.title}
                  </span>
                  <span
                    className={`
                      button-icon ml-auto !bg-transparent ${
                        script
                          ? item.id === fileId?.fileId
                            ? ""
                            : "invisible group-hover:visible"
                          : ""
                      }
                    `}
                  >
                    <MoreIcon className="h-3" />
                  </span>
                </div>
              );
            })}
        </div>
      </div>*/
}
