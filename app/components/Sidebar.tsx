import { useState } from "react";
import {
  AddIcon,
  ScriptIcon,
  SearchIcon,
  SideBarExpandIcon,
} from "../assets/icons";
import Logo from "../assets/logo";

export default function Sidebar() {
  const [isSearchOn, setIsSearchOn] = useState(false);

  const [scriptCount, setScriptCount] = useState(1);

  const handleAddScript = () => {
    setScriptCount((prevCount) => prevCount + 1);
  };

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
                onClick={handleAddScript}
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
          {[...Array(scriptCount)].map((script: any, index: any) => {
            return (
              <div
                key={index}
                className="select-none hover:bg-foreground-primary cursor-pointer rounded-lg flex items-center justify-start gap-2.5 px-4 py-[10px]"
              >
                <span className="w-[14px] aspect-square grid place-items-center shrink-0">
                  <ScriptIcon className="stroke-text-primary h-full stroke-[1px]" />
                </span>
                <span className="font-medium text-xs text-text-primary whitespace-nowrap overflow-hidden text-ellipsis">
                  Revolutionizing Quantitative Computing with AI
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
