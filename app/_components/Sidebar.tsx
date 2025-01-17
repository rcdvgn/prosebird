"use client";

import { useState, useEffect } from "react";
import {
  AddIcon,
  MoreIcon,
  ScriptIcon,
  SearchIcon,
  SideBarExpandIcon,
} from "../_assets/icons";
import Logo from "../_assets/logo";

import { useRouter } from "next/navigation";

import { createScript, getUserScripts } from "@/app/_services/client";

import { useAuth } from "../_contexts/AuthContext";
import { useScriptEditor } from "../_contexts/ScriptEditorContext";

import { useRecentScripts } from "@/app/_contexts/RecentScriptsContext";

export default function Sidebar(fileId: any) {
  const { user, logout } = useAuth();
  const { script, setScript } = useScriptEditor();
  const router = useRouter();

  const { recentlyModified } = useRecentScripts();

  const [isSearchOn, setIsSearchOn] = useState(false);
  const [scriptList, setScriptList] = useState<any>(null);

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

  return (
    <div className="w-[280px] [&>*]:px-3.5 [&>*]:mb-2 shrink-0">
      <div className="flex items-center justify-between h-[55px]">
        <span className="ml-[10px]">
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
        {/* <div className="h-[40px]">
          <div className="flex items-center justify-between">
            <span className="ml-[10px] font-bold text-sm text-primary">
              Scripts
            </span>
            <div className="flex gap-1">
              <div
                onClick={handleCreateScript}
                className={`btn-3 ${isSearchOn ? "bg-foreground" : ""}`}
              >
                <AddIcon className="" />
              </div>
              <div
                onClick={() => {
                  setIsSearchOn(!isSearchOn);
                }}
                className={`btn-3 ${isSearchOn ? "bg-foreground" : ""}`}
              >
                <SearchIcon className="" />
              </div>
            </div>
          </div>
          <input type="text" className="hidden" />
        </div> */}
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
      </button>
    </div>
  );
}
