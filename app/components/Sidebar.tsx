"use client";

import { useState, useEffect } from "react";
import {
  AddIcon,
  ScriptIcon,
  SearchIcon,
  SideBarExpandIcon,
} from "../assets/icons";
import Logo from "../assets/logo";

import { useRouter } from "next/navigation";

import { createScript, getUserScripts } from "@/app/actions/actions";

import { useAuth } from "../contexts/AuthContext";
import { useScriptEditor } from "../contexts/ScriptEditorContext";

export default function Sidebar() {
  const { user } = useAuth();
  const { script, setScript } = useScriptEditor();
  const router = useRouter();

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
    <div className="border-r-[1px] border-stroke w-[250px] [&>*]:px-4">
      <div className="border=2 border-red-500 flex items-center justify-between h-[55px]">
        <span className="ml-[10px]">
          <Logo />
        </span>
        <span className="w-[30px] grid place-items-center cursor-pointer">
          <SideBarExpandIcon className="fill-text-primary" />
        </span>
      </div>
      <div className="">
        <div className="py-[2px] mb-[10px]">
          <div className="flex items-center justify-between">
            <span className="ml-[10px] font-semibold text-sm text-text-primary">
              Scripts
            </span>
            <div className="flex gap-1">
              <div
                onClick={handleCreateScript}
                className={`btn-3 ${isSearchOn ? "bg-foreground-primary" : ""}`}
              >
                <AddIcon className="" />
              </div>
              <div
                onClick={() => {
                  setIsSearchOn(!isSearchOn);
                }}
                className={`btn-3 ${isSearchOn ? "bg-foreground-primary" : ""}`}
              >
                <SearchIcon className="" />
              </div>
            </div>
          </div>
          <input type="text" className="hidden" />
        </div>
        <div className="flex flex-col gap-0.5">
          {scriptList &&
            scriptList.map((item: any, index: any) => {
              return (
                <div
                  key={index}
                  className={`${
                    script
                      ? item.id === script.id
                        ? "bg-foreground-secondary"
                        : ""
                      : ""
                  } select-none hover:bg-foreground-secondary cursor-pointer rounded-lg flex items-center justify-start gap-2.5 px-4 py-[10px]`}
                >
                  <span className="w-[14px] aspect-square grid place-items-center shrink-0">
                    <ScriptIcon className="stroke-text-primary h-full stroke-[1px]" />
                  </span>
                  <span className="font-medium text-xs text-text-primary whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.title}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
