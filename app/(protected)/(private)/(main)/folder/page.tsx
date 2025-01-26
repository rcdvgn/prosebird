import {
  ClockIcon,
  CollaboratorsIcon,
  IsFavoriteIcon,
  MoreIcon,
} from "@/app/_assets/icons";
import React from "react";

export default function Folder() {
  const lines = [
    "Just one more tear to",
    "cry",
    "One teardrop from my",
    "eye",
    "You better save it for",
    "The middle of the",
    "night",
  ];

  return (
    <div className="slate p-7">
      <h1 className="">Dashboard {">"} school yearbook</h1>

      <div className="grid grid-cols-[repeat(auto-fill,250px)] gap-y-7 gap-x-5">
        {Array.from({ length: 10 }).map((_: any, index: any) => {
          return (
            <div
              key={index}
              className="group/container w-full border-[1px] border-stroke hover:border-border rounded-[10px] cursor-pointer hover:translate-y-[-5px] transition-all duration-200 ease-in-out"
            >
              <div className="relative w-full h-[178px] px-[18px] pt-3 mb-3 overflow-y-hidden">
                {lines.map((line: any, index: any) => {
                  return (
                    <span
                      key={index}
                      className="group-hover/container:text-primary/85 block font-bold text-xl text-placeholder leading-[33px] transition-colors duration-200 ease-in-out"
                    >
                      {line}
                    </span>
                  );
                })}

                <div className="absolute opacity-0 group-hover/container:opacity-100 flex items-center gap-1 right-[18px] bottom-3 p-2 rounded-full bg-hover transition-opacity duration-300 ease-in-out">
                  <ClockIcon className="h-2.5 text-secondary" />
                  <span className="font-semibold text-xs text-primary">
                    5 min
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-[10px] pb-4 pt-3.5 pl-[18px] w-full bg-background rounded-b-[10px] transition-colors duration-200 ease-in-out group-hover/container:bg-hover">
                <div className="flex justify-between items-center">
                  <div className="flex justify-start items-center gap-2 min-w-0">
                    <span className="text-primary font-bold text-sm truncate">
                      End of Beginning
                    </span>
                    <div className="flex items-center justify-start gap-1.5">
                      <CollaboratorsIcon className="h-2.5 text-placeholder" />
                      <IsFavoriteIcon className="h-3 text-placeholder" />
                    </div>
                  </div>
                  <span className="group/icon px-3.5 cursor-pointer">
                    <MoreIcon className="group-hover/icon:text-primary h-3 text-inactive" />
                  </span>
                </div>
                <span className="font-semibold text-[13px] text-secondary">
                  Opened 2 hours ago
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
