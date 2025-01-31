"use client";

import { useState, useEffect } from "react";
import {
  AddIcon,
  DashboardIcon,
  LogoIcon,
  MoreIcon,
  ScriptIcon,
  SearchIcon,
  ShrinkIcon,
  SideBarExpandIcon,
} from "../_assets/icons";
import Logo from "../_assets/logo";

import { useRouter } from "next/navigation";

import { createScript, getUserScripts } from "@/app/_services/client";

import { useAuth } from "../_contexts/AuthContext";
import { useScriptEditor } from "../_contexts/ScriptEditorContext";

import { useRecentScripts } from "@/app/_contexts/RecentScriptsContext";
import { useModal } from "../_contexts/ModalContext";
import Settings from "./modals/Settings";
import Input3 from "./ui/Input3";

export default function Sidebar(fileId: any) {
  const { user, logout } = useAuth();
  const { script, setScript } = useScriptEditor();
  const router = useRouter();

  const [isSidebarExpanded, setIsSidebarExpanded] = useState<any>(true);

  const { recentlyModified } = useRecentScripts();

  const [isSearchOn, setIsSearchOn] = useState<any>(false);
  const [scriptList, setScriptList] = useState<any>(null);

  const { openModal } = useModal();

  // const [scriptCount, setScriptCount] = useState(1);

  const handleCreateScript = async () => {
    if (user !== null) {
      const newScript = await createScript(user.id);
      setScript(newScript);
      router.push(`/file/${newScript.id}`);
    }
  };

  useEffect(() => {
    const handleGetAllScripts = async (userId: any) => {
      const newScriptList = await getUserScripts(userId);

      setScriptList(newScriptList);
    };
    if (user) {
      handleGetAllScripts(user.id);
    }
  }, [user]);

  // TEMPORARY
  const handleSettings = () => {
    openModal(<Settings />);
  };

  return (
    <div className="flex shrink-0">
      <div className="flex flex-col items-center justify-start w-[80px] border-[1px] border-blue-500">
        <div
          onClick={handleSettings}
          className="h-[68px] w-full grid place-items-center"
        >
          <LogoIcon className="h-5" />
        </div>

        <div className="flex flex-col items-center justify-start gap-4 w-full px-[18px] py-2.5">
          {Array.from({ length: 3 }).map((_: any, index: any) => {
            return (
              <div
                key={index}
                className="h-[44px] aspect-square grid place-items-center bg-brand/15 hover:bg-brand/20 transition-bg ease-in-out duration-100 rounded-xl cursor-pointer"
              >
                <DashboardIcon className="text-brand h-5" />
              </div>
            );
          })}
        </div>
      </div>

      {isSidebarExpanded && (
        <div className="border-pink-500 border-[1px] w-[300px] pr-3">
          <div className="h-[68px] w-full flex justify-between items-center px-4">
            <Input3 />

            <span
              onClick={() => setIsSidebarExpanded(false)}
              className="group button-icon !bg-transparent text-placeholder"
            >
              <ShrinkIcon className="h-3 transition-transform duration-200 ease-in-out group-hover:-translate-x-1" />
            </span>
          </div>
        </div>
      )}
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
      </div>

      <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Logout
      </button> */
}
